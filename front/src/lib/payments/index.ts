/**
 * Payment System - Main Export File
 * Unified interface for all cryptocurrency payment providers
 */

// Export types
export type {
  PaymentProvider,
  PaymentSession,
  PaymentStatus,
  CreatePaymentRequest,
  PaymentProviderService,
  WebhookPayload,
} from "./types";

// Export individual providers
export {
  FakePaymentProvider,
  createFakePaymentProvider,
  defaultFakeConfig,
} from "./fake-provider";

export type { FakePaymentConfig } from "./fake-provider";

export {
  BTCPayProvider,
  createBTCPayProvider,
  defaultBTCPayConfig,
} from "./btcpay";

export type { BTCPayConfig, BTCPayInvoice } from "./btcpay";

export {
  ShkeeperProvider,
  createShkeeperProvider,
  defaultShkeeperConfig,
} from "./shkeeper";

export type { ShkeeperConfig, ShkeeperInvoice } from "./shkeeper";

// Export payment manager (primary interface)
export { PaymentManager, paymentManager, getPaymentManager } from "./payment-manager";

// Re-export for backward compatibility with existing code
export { createBTCPayProvider as createBTCPayService } from "./btcpay";
export { createShkeeperProvider as createShkeeperService } from "./shkeeper";

export type BTCPayService = BTCPayProvider;
export type ShkeeperService = ShkeeperProvider;
