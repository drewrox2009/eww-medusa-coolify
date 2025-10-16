/**
 * Payment Manager
 * Unified interface for managing all payment providers
 */

import type {
  PaymentProvider,
  PaymentProviderService,
  CreatePaymentRequest,
  PaymentSession,
} from "./types";
import {
  FakePaymentProvider,
  createFakePaymentProvider,
  defaultFakeConfig,
} from "./fake-provider";
import {
  BTCPayProvider,
  createBTCPayProvider,
  defaultBTCPayConfig,
} from "./btcpay";
import {
  ShkeeperProvider,
  createShkeeperProvider,
  defaultShkeeperConfig,
} from "./shkeeper";

export class PaymentManager {
  private providers: Map<string, PaymentProviderService> = new Map();
  private providerMetadata: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize all payment providers
   */
  private initializeProviders() {
    // Fake/Test Provider (always enabled for development)
    const fakeProvider = createFakePaymentProvider(defaultFakeConfig);
    this.providers.set("fake", fakeProvider);
    this.providerMetadata.set("fake", {
      id: "fake",
      name: "Test Payment (Fake)",
      description: "Simulated payment for testing - auto-completes in 3 seconds",
      enabled: true,
      supportedCurrencies: ["USD", "EUR", "GBP"],
      requiresSetup: false,
      testMode: true,
    });

    // BTCPay Server
    const btcpayEnabled = !!(
      process.env.NEXT_PUBLIC_BTCPAY_SERVER_URL &&
      process.env.BTCPAY_API_KEY &&
      process.env.BTCPAY_STORE_ID
    );
    if (btcpayEnabled || process.env.NODE_ENV === "development") {
      const btcpayProvider = createBTCPayProvider(defaultBTCPayConfig);
      this.providers.set("btcpay", btcpayProvider);
      this.providerMetadata.set("btcpay", {
        id: "btcpay",
        name: "Bitcoin & Lightning",
        description: "Pay with Bitcoin or Lightning Network via BTCPay Server",
        logo: "/images/payments/btcpay.png",
        enabled: btcpayEnabled,
        supportedCurrencies: ["BTC"],
        requiresSetup: true,
      });
    }

    // Shkeeper
    const shkeeperEnabled = !!(
      process.env.NEXT_PUBLIC_SHKEEPER_API_URL && process.env.SHKEEPER_API_KEY
    );
    if (shkeeperEnabled || process.env.NODE_ENV === "development") {
      const shkeeperProvider = createShkeeperProvider(defaultShkeeperConfig);
      this.providers.set("shkeeper", shkeeperProvider);
      this.providerMetadata.set("shkeeper", {
        id: "shkeeper",
        name: "Shkeeper Multi-Crypto",
        description: "Pay with BTC, ETH, LTC, USDT, XMR, and more",
        logo: "/images/payments/shkeeper.png",
        enabled: shkeeperEnabled,
        supportedCurrencies: [
          "BTC",
          "ETH",
          "LTC",
          "USDT",
          "USDC",
          "BCH",
          "DOGE",
          "XMR",
          "TRX",
        ],
        requiresSetup: true,
      });
    }
  }

  /**
   * Get all available payment providers
   */
  getProviders(): PaymentProvider[] {
    return Array.from(this.providerMetadata.values());
  }

  /**
   * Get enabled payment providers only
   */
  getEnabledProviders(): PaymentProvider[] {
    return this.getProviders().filter((p) => p.enabled);
  }

  /**
   * Get a specific payment provider metadata
   */
  getProviderMetadata(providerId: string): PaymentProvider | undefined {
    return this.providerMetadata.get(providerId);
  }

  /**
   * Get a specific payment provider service
   */
  getProviderService(providerId: string): PaymentProviderService | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Create a payment session
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    const provider = this.providers.get(request.providerId);
    if (!provider) {
      throw new Error(`Payment provider ${request.providerId} not found`);
    }

    const metadata = this.providerMetadata.get(request.providerId);
    if (metadata && !metadata.enabled) {
      throw new Error(
        `Payment provider ${request.providerId} is not enabled. Please configure it first.`
      );
    }

    try {
      return await provider.createPayment(request);
    } catch (error) {
      console.error(
        `Payment creation failed for ${request.providerId}:`,
        error
      );
      throw new Error(
        `Failed to create payment with ${request.providerId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(
    providerId: string,
    paymentId: string
  ): Promise<PaymentSession> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    try {
      return await provider.getPaymentStatus(paymentId);
    } catch (error) {
      console.error(`Payment status check failed for ${providerId}:`, error);
      throw error;
    }
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(
    providerId: string,
    paymentId: string
  ): Promise<boolean> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return false;
    }

    try {
      return await provider.isPaymentCompleted(paymentId);
    } catch (error) {
      console.error(`Payment completion check failed for ${providerId}:`, error);
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
        results[providerId] = await provider.validateConfig();
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

  /**
   * Get provider by supported currency
   */
  getProvidersByCurrency(currency: string): PaymentProvider[] {
    return this.getEnabledProviders().filter((p) =>
      p.supportedCurrencies.includes(currency.toUpperCase())
    );
  }

  /**
   * Check if any provider is available
   */
  hasEnabledProviders(): boolean {
    return this.getEnabledProviders().length > 0;
  }
}

// Singleton instance
let paymentManagerInstance: PaymentManager | null = null;

export function getPaymentManager(): PaymentManager {
  if (!paymentManagerInstance) {
    paymentManagerInstance = new PaymentManager();
  }
  return paymentManagerInstance;
}

// Export for direct use
export const paymentManager = getPaymentManager();