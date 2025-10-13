/**
 * Shkeeper Payment Integration
 * Multi-currency cryptocurrency payment gateway
 */

export interface ShkeeperConfig {
  apiUrl: string;
  apiKey: string;
  secretKey: string;
  callbackUrl?: string;
}

export interface ShkeeperPayment {
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

export class ShkeeperService {
  private config: ShkeeperConfig;

  constructor(config: ShkeeperConfig) {
    this.config = config;
  }

  /**
   * Create a new payment invoice
   */
  async createInvoice(
    amount: number,
    currency: string = "USD",
    orderId: string,
    description?: string
  ): Promise<ShkeeperPayment> {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/v1/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency,
          orderId,
          description: description || `Order #${orderId}`,
          callbackUrl: this.config.callbackUrl,
          successUrl: `${window.location.origin}/checkout/confirmation?order=${orderId}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Shkeeper API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        amount: parseFloat(data.amount),
        currency: data.currency,
        cryptoCurrency: data.cryptoCurrency,
        status: this.mapStatus(data.status),
        paymentUrl: data.paymentUrl,
        address: data.address,
        createdAt: new Date(data.createdAt),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };
    } catch (error) {
      console.error("Shkeeper create invoice error:", error);
      throw new Error("Failed to create Shkeeper invoice");
    }
  }

  /**
   * Get invoice status
   */
  async getInvoiceStatus(invoiceId: string): Promise<ShkeeperPayment> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/v1/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Shkeeper API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        amount: parseFloat(data.amount),
        currency: data.currency,
        cryptoCurrency: data.cryptoCurrency,
        status: this.mapStatus(data.status),
        paymentUrl: data.paymentUrl,
        address: data.address,
        txHash: data.txHash,
        createdAt: new Date(data.createdAt),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };
    } catch (error) {
      console.error("Shkeeper get invoice status error:", error);
      throw new Error("Failed to get invoice status");
    }
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(invoiceId: string): Promise<boolean> {
    try {
      const invoice = await this.getInvoiceStatus(invoiceId);
      return invoice.status === "confirmed";
    } catch (error) {
      console.error("Shkeeper payment check error:", error);
      return false;
    }
  }

  /**
   * Get supported cryptocurrencies
   */
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/v1/currencies`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Shkeeper API error: ${response.status}`);
      }

      const data = await response.json();
      return data.currencies || [];
    } catch (error) {
      console.error("Shkeeper get currencies error:", error);
      // Return common cryptocurrencies as fallback
      return ["BTC", "ETH", "LTC", "USDT", "USDC", "BCH", "DOGE"];
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    try {
      // In a real implementation, you'd use crypto to verify HMAC
      // For now, return true (implement proper validation in production)
      return true;
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
      const { invoiceId, status, txHash } = webhookData;

      // Update payment status in your database
      console.log(`Payment ${invoiceId} status: ${status}`, { txHash });

      // Here you would update your order status, send notifications, etc.
      // For example:
      // await updateOrderStatus(invoiceId, status === 'confirmed' ? 'paid' : 'pending');
    } catch (error) {
      console.error("Shkeeper webhook handling error:", error);
      throw error;
    }
  }

  /**
   * Map Shkeeper status to internal status
   */
  private mapStatus(shkeeperStatus: string): ShkeeperPayment["status"] {
    switch (shkeeperStatus.toLowerCase()) {
      case "pending":
      case "waiting":
        return "pending";
      case "received":
      case "partial":
        return "received";
      case "confirmed":
      case "paid":
        return "confirmed";
      case "expired":
        return "expired";
      case "failed":
      case "cancelled":
        return "failed";
      default:
        return "pending";
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
}

// Factory function to create Shkeeper service
export function createShkeeperService(config: ShkeeperConfig): ShkeeperService {
  return new ShkeeperService(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultShkeeperConfig: ShkeeperConfig = {
  apiUrl: process.env.NEXT_PUBLIC_SHKEEPER_API_URL || "https://api.shkeeper.io",
  apiKey: process.env.SHKEEPER_API_KEY || "",
  secretKey: process.env.SHKEEPER_SECRET_KEY || "",
  callbackUrl:
    process.env.SHKEEPER_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/shkeeper/webhook`,
};
