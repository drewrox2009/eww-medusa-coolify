/**
 * Fake Payment Provider
 * For testing and development purposes
 * Simulates payment flow without actual transactions
 */

import type {
  PaymentProviderService,
  CreatePaymentRequest,
  PaymentSession,
  PaymentStatus,
} from "./types";

export interface FakePaymentConfig {
  autoComplete?: boolean;
  delayMs?: number;
  failureRate?: number; // 0-1, probability of payment failure
}

export class FakePaymentProvider implements PaymentProviderService {
  private config: FakePaymentConfig;
  private payments: Map<string, PaymentSession> = new Map();

  constructor(config: FakePaymentConfig = {}) {
    this.config = {
      autoComplete: config.autoComplete ?? true,
      delayMs: config.delayMs ?? 2000,
      failureRate: config.failureRate ?? 0,
    };
  }

  /**
   * Create a fake payment session
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    // Simulate API delay
    await this.delay(500);

    const paymentId = `fake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const payment: PaymentSession = {
      id: paymentId,
      providerId: "fake",
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency,
      status: "pending",
      paymentUrl: `/checkout/payment/${paymentId}`,
      address: this.generateFakeAddress(),
      qrCode: this.generateFakeQRCode(paymentId),
      expiresAt,
      createdAt: new Date(),
      metadata: {
        ...request.metadata,
        testMode: true,
        description: request.description,
      },
    };

    this.payments.set(paymentId, payment);

    // Auto-complete if enabled
    if (this.config.autoComplete) {
      this.scheduleAutoComplete(paymentId);
    }

    return payment;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentSession> {
    await this.delay(200);

    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    // Check if expired
    if (payment.expiresAt && new Date() > payment.expiresAt) {
      payment.status = "expired";
      this.payments.set(paymentId, payment);
    }

    return payment;
  }

  /**
   * Check if payment is completed
   */
  async isPaymentCompleted(paymentId: string): Promise<boolean> {
    try {
      const payment = await this.getPaymentStatus(paymentId);
      return payment.status === "completed";
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate configuration (always valid for fake provider)
   */
  async validateConfig(): Promise<boolean> {
    return true;
  }

  /**
   * Manually complete a payment (for testing)
   */
  async completePayment(paymentId: string): Promise<PaymentSession> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    // Simulate random failure
    if (Math.random() < this.config.failureRate!) {
      payment.status = "failed";
      payment.metadata = {
        ...payment.metadata,
        failureReason: "Simulated random failure",
      };
    } else {
      payment.status = "completed";
      payment.metadata = {
        ...payment.metadata,
        completedAt: new Date().toISOString(),
        txHash: this.generateFakeTxHash(),
      };
    }

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Manually fail a payment (for testing)
   */
  async failPayment(paymentId: string, reason?: string): Promise<PaymentSession> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    payment.status = "failed";
    payment.metadata = {
      ...payment.metadata,
      failureReason: reason || "Manual failure",
    };

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Get all payments (for debugging)
   */
  getAllPayments(): PaymentSession[] {
    return Array.from(this.payments.values());
  }

  /**
   * Clear all payments (for testing)
   */
  clearPayments(): void {
    this.payments.clear();
  }

  /**
   * Schedule auto-completion of payment
   */
  private scheduleAutoComplete(paymentId: string): void {
    setTimeout(async () => {
      try {
        await this.completePayment(paymentId);
        console.log(`[Fake Payment] Auto-completed payment ${paymentId}`);
      } catch (error) {
        console.error(`[Fake Payment] Failed to auto-complete ${paymentId}:`, error);
      }
    }, this.config.delayMs);
  }

  /**
   * Generate a fake cryptocurrency address
   */
  private generateFakeAddress(): string {
    const prefix = "fake";
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let address = prefix;
    for (let i = 0; i < 32; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }

  /**
   * Generate a fake transaction hash
   */
  private generateFakeTxHash(): string {
    const chars = "0123456789abcdef";
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  /**
   * Generate a fake QR code data URL
   */
  private generateFakeQRCode(paymentId: string): string {
    // In a real implementation, you'd generate an actual QR code
    // For now, return a data URL with text
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
          Fake QR Code
        </text>
        <text x="100" y="120" text-anchor="middle" font-size="8" fill="gray">
          ${paymentId}
        </text>
      </svg>`
    )}`;
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Factory function
export function createFakePaymentProvider(
  config?: FakePaymentConfig
): FakePaymentProvider {
  return new FakePaymentProvider(config);
}

// Default configuration
export const defaultFakeConfig: FakePaymentConfig = {
  autoComplete: true,
  delayMs: 3000,
  failureRate: 0,
};