/**
 * Shkeeper Payment Integration
 * Multi-currency cryptocurrency payment gateway
 * Compatible with Medusa payment providers
 */

import type {
  PaymentProviderService,
  CreatePaymentRequest,
  PaymentSession,
  PaymentStatus,
} from "./types";

export interface ShkeeperConfig {
  apiUrl: string;
  apiKey: string;
  secretKey: string;
  callbackUrl?: string;
  walletId?: string;
}

export interface ShkeeperInvoice {
  id: string;
  amount: number;
  currency: string;
  cryptoCurrency: string;
  status: "pending" | "received" | "confirmed" | "expired" | "failed";
  paymentUrl: string;
  address?: string;
  txHash?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export class ShkeeperProvider implements PaymentProviderService {
  private config: ShkeeperConfig;

  constructor(config: ShkeeperConfig) {
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
        providerId: "shkeeper",
        orderId: request.orderId,
        amount: invoice.amount,
        currency: invoice.cryptoCurrency,
        status: this.mapStatus(invoice.status),
        paymentUrl: invoice.paymentUrl,
        address: invoice.address,
        expiresAt: invoice.expiresAt,
        createdAt: invoice.createdAt,
        metadata: {
          fiatCurrency: request.currency,
          fiatAmount: request.amount,
          customerEmail: request.customerEmail,
        },
      };
    } catch (error) {
      console.error("Shkeeper create payment error:", error);
      throw new Error("Failed to create Shkeeper payment session");
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
        providerId: "shkeeper",
        orderId: "", // Would need to be stored/retrieved
        amount: invoice.amount,
        currency: invoice.cryptoCurrency,
        status: this.mapStatus(invoice.status),
        paymentUrl: invoice.paymentUrl,
        address: invoice.address,
        expiresAt: invoice.expiresAt,
        createdAt: invoice.createdAt,
        metadata: {
          txHash: invoice.txHash,
        },
      };
    } catch (error) {
      console.error("Shkeeper get payment status error:", error);
      throw error;
    }
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(paymentId: string): Promise<boolean> {
    try {
      const invoice = await this.getInvoiceStatus(paymentId);
      return invoice.status === "confirmed";
    } catch (error) {
      console.error("Shkeeper payment check error:", error);
      return false;
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/v1/status`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Shkeeper config validation error:", error);
      return false;
    }
  }

  /**
   * Create a new payment invoice
   */
  private async createInvoice(
    amount: number,
    currency: string = "USD",
    orderId: string,
    description?: string
  ): Promise<ShkeeperInvoice> {
    try {
      const payload: any = {
        external_id: orderId,
        fiat: currency,
        amount: amount.toString(),
        callback_url: this.config.callbackUrl,
        success_url: `${window.location.origin}/checkout/confirmation?order=${orderId}`,
        fail_url: `${window.location.origin}/checkout?error=payment_failed`,
      };

      if (this.config.walletId) {
        payload.wallet = this.config.walletId;
      }

      if (description) {
        payload.description = description;
      }

      const response = await fetch(`${this.config.apiUrl}/api/v1/invoices`, {
        method: "POST",
        headers: {
          "X-Shkeeper-API-Key": this.config.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Shkeeper API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      return {
        id: data.id || data.external_id,
        amount: parseFloat(data.amount || data.crypto_amount),
        currency: currency,
        cryptoCurrency: data.crypto || data.cryptocurrency || "BTC",
        status: this.mapShkeeperStatus(data.status),
        paymentUrl: data.url || data.payment_url,
        address: data.address || data.wallet,
        createdAt: new Date(data.created_at || Date.now()),
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      };
    } catch (error) {
      console.error("Shkeeper create invoice error:", error);
      throw error;
    }
  }

  /**
   * Get invoice status
   */
  private async getInvoiceStatus(invoiceId: string): Promise<ShkeeperInvoice> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/v1/invoices/${invoiceId}`,
        {
          headers: {
            "X-Shkeeper-API-Key": this.config.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Shkeeper API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id || data.external_id,
        amount: parseFloat(data.amount || data.crypto_amount),
        currency: data.fiat || "USD",
        cryptoCurrency: data.crypto || data.cryptocurrency || "BTC",
        status: this.mapShkeeperStatus(data.status),
        paymentUrl: data.url || data.payment_url,
        address: data.address || data.wallet,
        txHash: data.tx_hash || data.txid,
        createdAt: new Date(data.created_at || Date.now()),
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      };
    } catch (error) {
      console.error("Shkeeper get invoice status error:", error);
      throw error;
    }
  }

  /**
   * Get supported cryptocurrencies
   */
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/v1/currencies`, {
        headers: {
          "X-Shkeeper-API-Key": this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Shkeeper API error: ${response.status}`);
      }

      const data = await response.json();
      return data.currencies || data || [];
    } catch (error) {
      console.error("Shkeeper get currencies error:", error);
      // Return common cryptocurrencies as fallback
      return ["BTC", "ETH", "LTC", "USDT", "USDC", "BCH", "DOGE", "XMR", "TRX"];
    }
  }

  /**
   * Map Shkeeper status to internal status
   */
  private mapShkeeperStatus(
    shkeeperStatus: string
  ): ShkeeperInvoice["status"] {
    const status = shkeeperStatus.toLowerCase();
    switch (status) {
      case "pending":
      case "waiting":
      case "new":
        return "pending";
      case "received":
      case "partial":
      case "processing":
        return "received";
      case "confirmed":
      case "paid":
      case "completed":
        return "confirmed";
      case "expired":
      case "timeout":
        return "expired";
      case "failed":
      case "cancelled":
      case "error":
        return "failed";
      default:
        return "pending";
    }
  }

  /**
   * Map internal status to PaymentStatus
   */
  private mapStatus(shkeeperStatus: ShkeeperInvoice["status"]): PaymentStatus {
    switch (shkeeperStatus) {
      case "pending":
        return "pending";
      case "received":
        return "processing";
      case "confirmed":
        return "completed";
      case "expired":
        return "expired";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.secretKey) {
      console.warn("Shkeeper webhook secret not configured");
      return false;
    }

    try {
      // Use Node.js crypto for server-side verification
      if (typeof window === 'undefined') {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', this.config.secretKey);
        hmac.update(payload);
        const expectedSignature = hmac.digest('hex');
        
        return crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );
      }
      
      // Client-side: cannot verify securely, return false
      console.warn('Webhook verification should be done server-side');
      return false;
    } catch (error) {
      console.error("Shkeeper webhook validation error:", error);
      return false;
    }
  }

  /**
   * Handle payment webhook
   */
  async handleWebhook(webhookData: any): Promise<void> {
    try {
      const { id, external_id, status, tx_hash } = webhookData;

      console.log(`Shkeeper webhook: Payment ${id} status: ${status}`, {
        orderId: external_id,
        txHash: tx_hash,
      });

      // Here you would update your order status, send notifications, etc.
      // For example:
      // await updateOrderStatus(external_id, status === 'confirmed' ? 'paid' : 'pending');
    } catch (error) {
      console.error("Shkeeper webhook handling error:", error);
      throw error;
    }
  }
}

// Factory function to create Shkeeper service
export function createShkeeperProvider(config: ShkeeperConfig): ShkeeperProvider {
  return new ShkeeperProvider(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultShkeeperConfig: ShkeeperConfig = {
  apiUrl: process.env.NEXT_PUBLIC_SHKEEPER_API_URL || "https://api.shkeeper.io",
  apiKey: process.env.SHKEEPER_API_KEY || "",
  secretKey: process.env.SHKEEPER_SECRET_KEY || "",
  walletId: process.env.SHKEEPER_WALLET_ID || "",
  callbackUrl:
    process.env.SHKEEPER_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/shkeeper/webhook`,
};
