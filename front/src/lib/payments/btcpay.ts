/**
 * BTCPay Server Integration
 * Handles Bitcoin and Lightning Network payments
 * Compatible with Medusa payment providers
 */

import type {
  PaymentProviderService,
  CreatePaymentRequest,
  PaymentSession,
  PaymentStatus,
} from "./types";

export interface BTCPayConfig {
  serverUrl: string;
  apiKey: string;
  storeId: string;
  webhookSecret?: string;
}

export interface BTCPayInvoice {
  id: string;
  checkoutLink: string;
  amount: number;
  currency: string;
  status: "New" | "Processing" | "Settled" | "Expired" | "Invalid";
  expirationTime: Date;
  monitoringTime: Date;
}

export class BTCPayProvider implements PaymentProviderService {
  private config: BTCPayConfig;

  constructor(config: BTCPayConfig) {
    this.config = config;
  }

  /**
   * Create a new payment session
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    try {
      const invoice = await this.createInvoice(
        request.amount,
        request.currency,
        request.orderId,
        request.description
      );

      return {
        id: invoice.id,
        providerId: "btcpay",
        orderId: request.orderId,
        amount: invoice.amount,
        currency: invoice.currency,
        status: this.mapStatus(invoice.status),
        paymentUrl: invoice.checkoutLink,
        expiresAt: invoice.expirationTime,
        createdAt: new Date(),
        metadata: {
          monitoringTime: invoice.monitoringTime,
          customerEmail: request.customerEmail,
        },
      };
    } catch (error) {
      console.error("BTCPay create payment error:", error);
      throw new Error("Failed to create BTCPay payment session");
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentSession> {
    try {
      const invoice = await this.getInvoiceStatus(paymentId);

      return {
        id: invoice.id,
        providerId: "btcpay",
        orderId: "", // Would need to be stored/retrieved
        amount: invoice.amount,
        currency: invoice.currency,
        status: this.mapStatus(invoice.status),
        paymentUrl: invoice.checkoutLink,
        expiresAt: invoice.expirationTime,
        createdAt: new Date(), // Would need to be stored/retrieved
        metadata: {
          monitoringTime: invoice.monitoringTime,
        },
      };
    } catch (error) {
      console.error("BTCPay get payment status error:", error);
      throw error;
    }
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(paymentId: string): Promise<boolean> {
    try {
      const invoice = await this.getInvoiceStatus(paymentId);
      return invoice.status === "Settled";
    } catch (error) {
      console.error("BTCPay payment check error:", error);
      return false;
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.serverUrl}/api/v1/stores/${this.config.storeId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error("BTCPay config validation error:", error);
      return false;
    }
  }

  /**
   * Create a new invoice for payment
   */
  private async createInvoice(
    amount: number,
    currency: string = "USD",
    orderId: string,
    description?: string
  ): Promise<BTCPayInvoice> {
    try {
      const response = await fetch(
        `${this.config.serverUrl}/api/v1/stores/${this.config.storeId}/invoices`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount.toString(),
            currency,
            orderId,
            metadata: {
              orderId,
              description: description || `Order #${orderId}`,
            },
            checkout: {
              speedPolicy: "MediumSpeed",
              paymentMethods: ["BTC", "BTC-LightningNetwork"],
              redirectURL: `${window.location.origin}/checkout/confirmation?order=${orderId}`,
              defaultLanguage: "en",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `BTCPay API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      return {
        id: data.id,
        checkoutLink: data.checkoutLink,
        amount: parseFloat(data.amount),
        currency: data.currency,
        status: data.status,
        expirationTime: new Date(data.expirationTime),
        monitoringTime: new Date(data.monitoringTime),
      };
    } catch (error) {
      console.error("BTCPay create invoice error:", error);
      throw error;
    }
  }

  /**
   * Get invoice status
   */
  private async getInvoiceStatus(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      const response = await fetch(
        `${this.config.serverUrl}/api/v1/stores/${this.config.storeId}/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`BTCPay API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        checkoutLink: data.checkoutLink,
        amount: parseFloat(data.amount),
        currency: data.currency,
        status: data.status,
        expirationTime: new Date(data.expirationTime),
        monitoringTime: new Date(data.monitoringTime),
      };
    } catch (error) {
      console.error("BTCPay get invoice status error:", error);
      throw error;
    }
  }

  /**
   * Map BTCPay status to internal status
   */
  private mapStatus(btcpayStatus: string): PaymentStatus {
    switch (btcpayStatus) {
      case "New":
        return "pending";
      case "Processing":
        return "processing";
      case "Settled":
        return "completed";
      case "Expired":
        return "expired";
      case "Invalid":
        return "failed";
      default:
        return "pending";
    }
  }

  /**
   * Get supported payment methods
   */
  getSupportedMethods(): string[] {
    return ["BTC", "BTC-LightningNetwork"];
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.warn("BTCPay webhook secret not configured");
      return false;
    }

    try {
      // BTCPay uses HMAC-SHA256 with format "sha256=<signature>"
      const signatureParts = signature.split('=');
      if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
        console.error('Invalid BTCPay signature format');
        return false;
      }

      // Use Node.js crypto for server-side verification
      if (typeof window === 'undefined') {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', this.config.webhookSecret);
        hmac.update(payload);
        const expectedSignature = hmac.digest('hex');
        
        return crypto.timingSafeEqual(
          Buffer.from(signatureParts[1]),
          Buffer.from(expectedSignature)
        );
      }
      
      // Client-side: cannot verify securely, return false
      console.warn('Webhook verification should be done server-side');
      return false;
    } catch (error) {
      console.error('BTCPay webhook verification error:', error);
      return false;
    }
  }
}

// Factory function to create BTCPay service
export function createBTCPayProvider(config: BTCPayConfig): BTCPayProvider {
  return new BTCPayProvider(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultBTCPayConfig: BTCPayConfig = {
  serverUrl:
    process.env.NEXT_PUBLIC_BTCPAY_SERVER_URL || "https://btcpay.example.com",
  apiKey: process.env.BTCPAY_API_KEY || "",
  storeId: process.env.BTCPAY_STORE_ID || "",
  webhookSecret: process.env.BTCPAY_WEBHOOK_SECRET || "",
};
