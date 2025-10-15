/**
 * NowPayments Integration
 * Multi-cryptocurrency payment processor supporting 100+ coins
 */

export interface NowPaymentsConfig {
  apiKey: string;
  secretKey?: string;
  ipnSecret?: string;
  callbackUrl?: string;
}

export interface NowPaymentsInvoice {
  id: string;
  paymentId: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  payUrl: string;
  priceAmount: number;
  priceCurrency: string;
  status:
    | "waiting"
    | "confirming"
    | "confirmed"
    | "sending"
    | "partially_paid"
    | "finished"
    | "failed"
    | "refunded"
    | "expired";
  createdAt: Date;
  updatedAt?: Date;
}

export class NowPaymentsService {
  private config: NowPaymentsConfig;
  private baseUrl = "https://api.nowpayments.io/v1";

  constructor(config: NowPaymentsConfig) {
    this.config = config;
  }

  /**
   * Create a payment invoice
   */
  async createInvoice(
    amount: number,
    currency: string = "USD",
    orderId: string,
    description?: string
  ): Promise<NowPaymentsInvoice> {
    try {
      const response = await fetch(`${this.baseUrl}/invoice`, {
        method: "POST",
        headers: {
          "x-api-key": this.config.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: currency,
          order_id: orderId,
          order_description: description || `Order #${orderId}`,
          ipn_callback_url: this.config.callbackUrl,
          success_url: `${window.location.origin}/checkout/confirmation?order=${orderId}`,
          cancel_url: `${window.location.origin}/cart`,
          partially_paid_url: `${window.location.origin}/checkout?order=${orderId}`,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`NowPayments API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        paymentId: data.payment_id,
        payAddress: data.pay_address,
        payAmount: parseFloat(data.pay_amount),
        payCurrency: data.pay_currency,
        payUrl: data.pay_url,
        priceAmount: parseFloat(data.price_amount),
        priceCurrency: data.price_currency,
        status: data.payment_status || "waiting",
        createdAt: new Date(data.created_at || Date.now()),
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      };
    } catch (error) {
      console.error("NowPayments create invoice error:", error);
      throw new Error("Failed to create NowPayments invoice");
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<NowPaymentsInvoice> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/${paymentId}`, {
        headers: {
          "x-api-key": this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`NowPayments API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.invoice_id || data.id,
        paymentId: data.payment_id,
        payAddress: data.pay_address,
        payAmount: parseFloat(data.pay_amount),
        payCurrency: data.pay_currency,
        payUrl: data.pay_url,
        priceAmount: parseFloat(data.price_amount),
        priceCurrency: data.price_currency,
        status: data.payment_status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("NowPayments get payment status error:", error);
      throw new Error("Failed to get payment status");
    }
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(paymentId: string): Promise<boolean> {
    try {
      const payment = await this.getPaymentStatus(paymentId);
      return ["finished", "confirmed"].includes(payment.status);
    } catch (error) {
      console.error("NowPayments payment check error:", error);
      return false;
    }
  }

  /**
   * Get available payment currencies
   */
  async getAvailableCurrencies(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/currencies`, {
        headers: {
          "x-api-key": this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`NowPayments API error: ${response.status}`);
      }

      const data = await response.json();
      return data.currencies || [];
    } catch (error) {
      console.error("NowPayments get currencies error:", error);
      // Return common cryptocurrencies as fallback
      return [
        "BTC",
        "ETH",
        "LTC",
        "USDT",
        "USDC",
        "BCH",
        "DOGE",
        "ADA",
        "DOT",
        "SOL",
        "MATIC",
        "AVAX",
        "LINK",
        "UNI",
        "AAVE",
        "SUSHI",
        "COMP",
        "MKR",
        "YFI",
        "BAL",
        "REN",
        "LRC",
        "OMG",
        "BAT",
        "ZRX",
        "REP",
        "GNT",
        "STORJ",
        "ANT",
        "XRP",
        "XLM",
        "ALGO",
        "ICP",
        "FIL",
        "HBAR",
        "NEAR",
        "FLOW",
        "MANA",
        "SAND",
        "AXS",
        "ENJ",
        "GALA",
        "CHZ",
        "SLP",
        "TLM",
        "RFOX",
        "SHIB",
      ];
    }
  }

  /**
   * Get minimum payment amount for a currency
   */
  async getMinAmount(currency: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/min-amount?currency_from=${currency}`,
        {
          headers: {
            "x-api-key": this.config.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`NowPayments API error: ${response.status}`);
      }

      const data = await response.json();
      return parseFloat(data.min_amount || "0");
    } catch (error) {
      console.error("NowPayments get min amount error:", error);
      return 0;
    }
  }

  /**
   * Validate IPN (Instant Payment Notification)
   */
  validateIPN(payload: any, signature: string): boolean {
    try {
      // In production, implement proper HMAC validation using secret key
      // For now, return true (implement proper validation)
      return true;
    } catch (error) {
      console.error("NowPayments IPN validation error:", error);
      return false;
    }
  }

  /**
   * Handle IPN webhook
   */
  async handleIPN(ipnData: any): Promise<void> {
    try {
      const {
        payment_id,
        payment_status,
        pay_address,
        pay_amount,
        pay_currency,
        order_id,
        order_description,
      } = ipnData;

      console.log(`NowPayments IPN: ${payment_id} - ${payment_status}`, {
        pay_address,
        pay_amount,
        pay_currency,
        order_id,
      });

      // Update order status based on payment status
      // In a real implementation, you'd update your database here
      if (payment_status === "finished") {
        // Mark order as paid
        console.log(`Order ${order_id} payment completed`);
      } else if (payment_status === "failed") {
        // Handle failed payment
        console.log(`Order ${order_id} payment failed`);
      }
    } catch (error) {
      console.error("NowPayments IPN handling error:", error);
      throw error;
    }
  }

  /**
   * Get estimated exchange rate
   */
  async getEstimatedPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/estimate?amount=${amount}&currency_from=${fromCurrency}&currency_to=${toCurrency}`,
        {
          headers: {
            "x-api-key": this.config.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`NowPayments API error: ${response.status}`);
      }

      const data = await response.json();
      return parseFloat(data.estimated_amount || "0");
    } catch (error) {
      console.error("NowPayments get estimated price error:", error);
      return 0;
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: {
          "x-api-key": this.config.apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("NowPayments config validation error:", error);
      return false;
    }
  }
}

// Factory function to create NowPayments service
export function createNowPaymentsService(
  config: NowPaymentsConfig
): NowPaymentsService {
  return new NowPaymentsService(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultNowPaymentsConfig: NowPaymentsConfig = {
  apiKey: process.env.NOWPAYMENTS_API_KEY || "",
  secretKey: process.env.NOWPAYMENTS_SECRET_KEY || "",
  ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET || "",
  callbackUrl:
    process.env.NOWPAYMENTS_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/nowpayments/ipn`,
};
