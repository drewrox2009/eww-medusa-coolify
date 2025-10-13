/**
 * Payment Providers Integration
 * Unified interface for all cryptocurrency payment providers
 */

import {
  createBTCPayService,
  BTCPayService,
  defaultBTCPayConfig,
} from "./btcpay";
import {
  createSolanaPaymentService,
  SolanaPaymentService,
  defaultSolanaConfig,
} from "./solana";
import {
  createShkeeperService,
  ShkeeperService,
  defaultShkeeperConfig,
} from "./shkeeper";
import {
  createNowPaymentsService,
  NowPaymentsService,
  defaultNowPaymentsConfig,
} from "./nowpayments";

export interface PaymentProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  supportedCurrencies: string[];
  service: any;
}

export interface PaymentSession {
  id: string;
  providerId: string;
  paymentUrl: string;
  address?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  expiresAt?: Date;
}

export class PaymentManager {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize all payment providers
   */
  private initializeProviders() {
    // BTCPay Server
    this.providers.set("btcpay", {
      id: "btcpay",
      name: "Bitcoin/Lightning (BTCPay)",
      description: "Pay with Bitcoin or Lightning Network",
      logo: "/images/payments/btcpay.png",
      supportedCurrencies: ["BTC"],
      service: createBTCPayService(defaultBTCPayConfig),
    });

    // Solana
    this.providers.set("solana", {
      id: "solana",
      name: "Solana (SPL Tokens)",
      description: "Pay with Solana and SPL tokens",
      logo: "/images/payments/solana.png",
      supportedCurrencies: ["SOL", "USDC"],
      service: createSolanaPaymentService(defaultSolanaConfig),
    });

    // Shkeeper
    this.providers.set("shkeeper", {
      id: "shkeeper",
      name: "Shkeeper",
      description: "Multi-currency crypto payments",
      logo: "/images/payments/shkeeper.png",
      supportedCurrencies: ["BTC", "ETH", "LTC", "USDT", "USDC", "BCH", "DOGE"],
      service: createShkeeperService(defaultShkeeperConfig),
    });

    // NowPayments
    this.providers.set("nowpayments", {
      id: "nowpayments",
      name: "NowPayments",
      description: "100+ cryptocurrencies supported",
      logo: "/images/payments/nowpayments.png",
      supportedCurrencies: [
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
        "XRP",
        "XLM",
        "ALGO",
      ],
      service: createNowPaymentsService(defaultNowPaymentsConfig),
    });
  }

  /**
   * Get all available payment providers
   */
  getProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get a specific payment provider
   */
  getProvider(providerId: string): PaymentProvider | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Create a payment session
   */
  async createPaymentSession(
    providerId: string,
    amount: number,
    currency: string = "USD",
    orderId: string,
    description?: string
  ): Promise<PaymentSession> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    try {
      let paymentData: any;

      switch (providerId) {
        case "btcpay":
          paymentData = await (provider.service as BTCPayService).createInvoice(
            amount,
            currency,
            orderId,
            description
          );
          return {
            id: paymentData.id,
            providerId,
            paymentUrl: paymentData.checkoutLink,
            amount: paymentData.amount,
            currency: paymentData.currency,
            status: "pending",
            expiresAt: paymentData.expirationTime,
          };

        case "solana":
          paymentData = await (
            provider.service as SolanaPaymentService
          ).generatePaymentAddress(amount, "SOL", orderId);
          return {
            id: paymentData.paymentId,
            providerId,
            paymentUrl: `solana:${paymentData.address}?amount=${paymentData.amount}`,
            address: paymentData.address,
            amount: paymentData.amount,
            currency: "SOL",
            status: "pending",
          };

        case "shkeeper":
          paymentData = await (
            provider.service as ShkeeperService
          ).createInvoice(amount, currency, orderId, description);
          return {
            id: paymentData.id,
            providerId,
            paymentUrl: paymentData.paymentUrl,
            address: paymentData.address,
            amount: paymentData.amount,
            currency: paymentData.cryptoCurrency,
            status: "pending",
            expiresAt: paymentData.expiresAt,
          };

        case "nowpayments":
          paymentData = await (
            provider.service as NowPaymentsService
          ).createInvoice(amount, currency, orderId, description);
          return {
            id: paymentData.id,
            providerId,
            paymentUrl: paymentData.payUrl,
            address: paymentData.payAddress,
            amount: paymentData.payAmount,
            currency: paymentData.payCurrency,
            status: "pending",
          };

        default:
          throw new Error(`Unsupported payment provider: ${providerId}`);
      }
    } catch (error) {
      console.error(
        `Payment session creation failed for ${providerId}:`,
        error
      );
      throw new Error(`Failed to create payment session with ${providerId}`);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(
    providerId: string,
    paymentId: string
  ): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    try {
      switch (providerId) {
        case "btcpay":
          return await (provider.service as BTCPayService).isPaymentSettled(
            paymentId
          );

        case "solana":
          // For Solana, we'd need transaction signature
          // This is simplified - in production you'd implement proper checking
          return false;

        case "shkeeper":
          return await (provider.service as ShkeeperService).isPaymentCompleted(
            paymentId
          );

        case "nowpayments":
          return await (
            provider.service as NowPaymentsService
          ).isPaymentCompleted(paymentId);

        default:
          return false;
      }
    } catch (error) {
      console.error(`Payment status check failed for ${providerId}:`, error);
      return false;
    }
  }

  /**
   * Validate all provider configurations
   */
  async validateConfigurations(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [providerId, provider] of this.providers) {
      try {
        switch (providerId) {
          case "btcpay":
            results[providerId] = await (
              provider.service as BTCPayService
            ).validateConfig();
            break;
          case "solana":
            results[providerId] = await (
              provider.service as SolanaPaymentService
            ).validateConfig();
            break;
          case "shkeeper":
            results[providerId] = await (
              provider.service as ShkeeperService
            ).validateConfig();
            break;
          case "nowpayments":
            results[providerId] = await (
              provider.service as NowPaymentsService
            ).validateConfig();
            break;
          default:
            results[providerId] = false;
        }
      } catch (error) {
        console.error(
          `Configuration validation failed for ${providerId}:`,
          error
        );
        results[providerId] = false;
      }
    }

    return results;
  }
}

// Singleton instance
export const paymentManager = new PaymentManager();

// Export individual services for direct use
export {
  createBTCPayService,
  createSolanaPaymentService,
  createShkeeperService,
  createNowPaymentsService,
  defaultBTCPayConfig,
  defaultSolanaConfig,
  defaultShkeeperConfig,
  defaultNowPaymentsConfig,
};

export type {
  BTCPayService,
  SolanaPaymentService,
  ShkeeperService,
  NowPaymentsService,
};
