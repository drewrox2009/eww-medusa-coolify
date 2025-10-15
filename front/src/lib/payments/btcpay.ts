/**
 * BTCPay Server Integration
 * Handles Bitcoin and Lightning Network payments
 */

export interface BTCPayConfig {
  serverUrl: string;
  apiKey: string;
  storeId: string;
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

export class BTCPayService {
  private config: BTCPayConfig;

  constructor(config: BTCPayConfig) {
    this.config = config;
  }

  /**
   * Create a new invoice for payment
   */
  async createInvoice(
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
            description: description || `Order #${orderId}`,
            checkout: {
              speedPolicy: "MediumSpeed",
              paymentMethods: ["BTC", "BTC-LightningNetwork"],
            },
          }),
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
      console.error("BTCPay create invoice error:", error);
      throw new Error("Failed to create BTCPay invoice");
    }
  }

  /**
   * Get invoice status
   */
  async getInvoiceStatus(invoiceId: string): Promise<BTCPayInvoice> {
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
      throw new Error("Failed to get invoice status");
    }
  }

  /**
   * Check if payment is settled
   */
  async isPaymentSettled(invoiceId: string): Promise<boolean> {
    try {
      const invoice = await this.getInvoiceStatus(invoiceId);
      return invoice.status === "Settled";
    } catch (error) {
      console.error("BTCPay payment check error:", error);
      return false;
    }
  }

  /**
   * Get supported payment methods
   */
  getSupportedMethods(): string[] {
    return ["BTC", "BTC-LightningNetwork"];
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
}

// Factory function to create BTCPay service
export function createBTCPayService(config: BTCPayConfig): BTCPayService {
  return new BTCPayService(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultBTCPayConfig: BTCPayConfig = {
  serverUrl:
    process.env.NEXT_PUBLIC_BTCPAY_SERVER_URL || "https://btcpay.example.com",
  apiKey: process.env.BTCPAY_API_KEY || "",
  storeId: process.env.BTCPAY_STORE_ID || "",
};
