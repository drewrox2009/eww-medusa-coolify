/**
 * Payment Provider Types and Interfaces
 * Unified type definitions for all payment providers
 */

export type PaymentStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "failed" 
  | "expired" 
  | "cancelled";

export interface PaymentProvider {
  id: string;
  name: string;
  description: string;
  logo?: string;
  enabled: boolean;
  supportedCurrencies: string[];
  requiresSetup: boolean;
  testMode?: boolean;
}

export interface PaymentSession {
  id: string;
  providerId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentUrl?: string;
  address?: string;
  qrCode?: string;
  expiresAt?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface CreatePaymentRequest {
  providerId: string;
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export interface PaymentProviderService {
  createPayment(request: CreatePaymentRequest): Promise<PaymentSession>;
  getPaymentStatus(paymentId: string): Promise<PaymentSession>;
  isPaymentCompleted(paymentId: string): Promise<boolean>;
  validateConfig(): Promise<boolean>;
}

export interface WebhookPayload {
  providerId: string;
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  amount?: number;
  currency?: string;
  txHash?: string;
  timestamp: Date;
  signature?: string;
  rawData: any;
}