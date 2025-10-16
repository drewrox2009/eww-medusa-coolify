import { NextRequest, NextResponse } from "next/server";
import { verifyShkeeperSignature } from "@/lib/payments/crypto-utils";

/**
 * Shkeeper Webhook Handler
 * Receives payment notifications from Shkeeper
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    
    console.log("[Shkeeper Webhook] Received:", body);

    // Verify webhook signature
    const signature = request.headers.get("x-shkeeper-signature");
    const webhookSecret = process.env.SHKEEPER_SECRET_KEY;

    if (!webhookSecret) {
      console.error("[Shkeeper Webhook] Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("[Shkeeper Webhook] Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify the signature
    const isValid = verifyShkeeperSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error("[Shkeeper Webhook] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract payment information
    const {
      id,
      external_id: orderId,
      status,
      amount,
      crypto,
      fiat,
      tx_hash: txHash,
      wallet,
      created_at,
      confirmed_at,
    } = body;

    console.log(`[Shkeeper Webhook] Verified webhook for payment ${id}, order ${orderId}`);

    // Map Shkeeper status to internal status
    let paymentStatus: string;
    let orderStatus: string;
    
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
      case "completed":
        paymentStatus = "completed";
        orderStatus = "paid";
        
        console.log(`[Shkeeper Webhook] Payment ${id} confirmed`);
        
        // TODO: Update order status in database
        // await updateOrderPaymentStatus(orderId, orderStatus, {
        //   paymentId: id,
        //   provider: "shkeeper",
        //   status: paymentStatus,
        //   txHash,
        //   amount,
        //   crypto,
        //   fiat,
        //   wallet,
        //   confirmedAt: confirmed_at,
        // });
        
        // TODO: Send confirmation email
        // await sendOrderConfirmationEmail(orderId, {
        //   txHash,
        //   amount,
        //   crypto,
        // });
        
        // TODO: Trigger fulfillment
        // await triggerOrderFulfillment(orderId);
        
        break;
      
      case "pending":
      case "waiting":
      case "new":
        paymentStatus = "pending";
        orderStatus = "pending_payment";
        
        console.log(`[Shkeeper Webhook] Payment ${id} pending`);
        
        // TODO: Update order status
        // await updateOrderPaymentStatus(orderId, orderStatus, {
        //   paymentId: id,
        //   provider: "shkeeper",
        //   status: paymentStatus,
        //   wallet,
        // });
        
        break;
      
      case "received":
      case "partial":
      case "processing":
        paymentStatus = "processing";
        orderStatus = "processing_payment";
        
        console.log(`[Shkeeper Webhook] Payment ${id} processing`);
        
        // TODO: Update order status
        // await updateOrderPaymentStatus(orderId, orderStatus, {
        //   paymentId: id,
        //   provider: "shkeeper",
        //   status: paymentStatus,
        //   txHash,
        //   amount,
        //   crypto,
        // });
        
        break;
      
      case "expired":
      case "timeout":
        paymentStatus = "expired";
        orderStatus = "payment_expired";
        
        console.log(`[Shkeeper Webhook] Payment ${id} expired`);
        
        // TODO: Update order status
        // await updateOrderPaymentStatus(orderId, orderStatus, {
        //   paymentId: id,
        //   provider: "shkeeper",
        //   status: paymentStatus,
        // });
        
        // TODO: Send expiration notification
        // await sendPaymentExpirationEmail(orderId);
        
        break;
      
      case "failed":
      case "cancelled":
      case "error":
        paymentStatus = "failed";
        orderStatus = "payment_failed";
        
        console.log(`[Shkeeper Webhook] Payment ${id} failed`);
        
        // TODO: Update order status
        // await updateOrderPaymentStatus(orderId, orderStatus, {
        //   paymentId: id,
        //   provider: "shkeeper",
        //   status: paymentStatus,
        // });
        
        break;
      
      default:
        paymentStatus = "pending";
        orderStatus = "pending_payment";
        console.log(`[Shkeeper Webhook] Unknown status: ${status}`);
    }

    return NextResponse.json({ 
      received: true,
      paymentId: id,
      orderId,
      status: paymentStatus,
    });
  } catch (error) {
    console.error("[Shkeeper Webhook] Error:", error);
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
    service: "Shkeeper Webhook Handler",
    status: "active",
    configured: !!process.env.SHKEEPER_SECRET_KEY,
  });
}