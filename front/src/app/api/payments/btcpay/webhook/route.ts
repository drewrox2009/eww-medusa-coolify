import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * BTCPay Server Webhook Handler
 * Receives payment notifications from BTCPay Server
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    
    console.log("[BTCPay Webhook] Received:", body);

    // Verify webhook signature
    const signature = request.headers.get("btcpay-sig");
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[BTCPay Webhook] Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("[BTCPay Webhook] Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify the signature - BTCPay format: "sha256=<signature>"
    const signatureParts = signature.split('=');
    if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
      console.error("[BTCPay Webhook] Invalid signature format");
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 401 }
      );
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest('hex');
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signatureParts[1]),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.error("[BTCPay Webhook] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract payment information
    const {
      invoiceId,
      orderId,
      status,
      type,
      metadata,
    } = body;

    console.log(`[BTCPay Webhook] Verified webhook for invoice ${invoiceId}`);

    // Handle different event types
    switch (type) {
      case "InvoiceSettled":
        console.log(`[BTCPay Webhook] Invoice ${invoiceId} settled`);
        
        // TODO: Update order status in database
        // Example implementation:
        // await updateOrderPaymentStatus(orderId, "paid", {
        //   paymentId: invoiceId,
        //   provider: "btcpay",
        //   status: "settled",
        //   metadata,
        // });
        
        // TODO: Send confirmation email
        // await sendOrderConfirmationEmail(orderId);
        
        // TODO: Trigger fulfillment
        // await triggerOrderFulfillment(orderId);
        
        break;
      
      case "InvoiceProcessing":
        console.log(`[BTCPay Webhook] Invoice ${invoiceId} processing`);
        break;
      
      case "InvoiceExpired":
        console.log(`[BTCPay Webhook] Invoice ${invoiceId} expired`);
        break;
      
      case "InvoiceInvalid":
        console.log(`[BTCPay Webhook] Invoice ${invoiceId} invalid`);
        break;
      
      default:
        console.log(`[BTCPay Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ 
      received: true,
      invoiceId,
      type,
    });
  } catch (error) {
    console.error("[BTCPay Webhook] Error:", error);
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification/health check)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: "BTCPay Webhook Handler",
    status: "active",
    configured: !!process.env.BTCPAY_WEBHOOK_SECRET,
  });
}