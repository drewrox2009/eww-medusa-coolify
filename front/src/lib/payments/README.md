# Payment System Documentation

## Overview

This directory contains the payment integration system supporting multiple cryptocurrency payment providers.

## Structure

```
payments/
├── types.ts              # TypeScript interfaces and types
├── payment-manager.ts    # Main payment orchestration
├── fake-provider.ts      # Test/development provider
├── btcpay.ts            # BTCPay Server integration
├── shkeeper.ts          # Shkeeper integration
└── index.ts             # Public exports
```

## Quick Start

### Using the Payment Manager

```typescript
import { paymentManager } from "@/lib/payments/payment-manager";

// Get available providers
const providers = paymentManager.getEnabledProviders();

// Create a payment
const payment = await paymentManager.createPayment({
  providerId: "fake",
  orderId: "order_123",
  amount: 99.99,
  currency: "USD",
  description: "Order #123",
});

// Check payment status
const status = await paymentManager.getPaymentStatus("fake", payment.id);

// Check if completed
const isCompleted = await paymentManager.isPaymentCompleted("fake", payment.id);
```

## Payment Providers

### 1. Fake Provider (Development)

```typescript
import { createFakePaymentProvider } from "./fake-provider";

const provider = createFakePaymentProvider({
  autoComplete: true,
  delayMs: 3000,
  failureRate: 0,
});
```

**Features**:
- Auto-completes after configurable delay
- Simulates payment flow
- No external dependencies
- Perfect for testing

### 2. BTCPay Server

```typescript
import { createBTCPayProvider } from "./btcpay";

const provider = createBTCPayProvider({
  serverUrl: "https://btcpay.example.com",
  apiKey: "your_api_key",
  storeId: "your_store_id",
});
```

**Features**:
- Bitcoin on-chain payments
- Lightning Network support
- Self-hosted option
- Privacy-focused

### 3. Shkeeper

```typescript
import { createShkeeperProvider } from "./shkeeper";

const provider = createShkeeperProvider({
  apiUrl: "https://api.shkeeper.io",
  apiKey: "your_api_key",
  secretKey: "your_secret_key",
  walletId: "your_wallet_id",
});
```

**Features**:
- Multiple cryptocurrencies
- Automatic conversion
- Low fees
- Fast confirmations

## Type Definitions

### PaymentProvider

```typescript
interface PaymentProvider {
  id: string;
  name: string;
  description: string;
  logo?: string;
  enabled: boolean;
  supportedCurrencies: string[];
  requiresSetup: boolean;
  testMode?: boolean;
}
```

### PaymentSession

```typescript
interface PaymentSession {
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
```

### PaymentStatus

```typescript
type PaymentStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "failed" 
  | "expired" 
  | "cancelled";
```

## Configuration

All providers are configured via environment variables. See [`PAYMENT_SETUP_GUIDE.md`](../../../../../PAYMENT_SETUP_GUIDE.md) for detailed setup instructions.

### Required Environment Variables

```env
# BTCPay (optional)
NEXT_PUBLIC_BTCPAY_SERVER_URL=
BTCPAY_API_KEY=
BTCPAY_STORE_ID=
BTCPAY_WEBHOOK_SECRET=

# Shkeeper (optional)
NEXT_PUBLIC_SHKEEPER_API_URL=
SHKEEPER_API_KEY=
SHKEEPER_SECRET_KEY=
SHKEEPER_WALLET_ID=
```

## Error Handling

All payment operations throw errors that should be caught and handled:

```typescript
try {
  const payment = await paymentManager.createPayment(request);
} catch (error) {
  if (error instanceof Error) {
    console.error("Payment failed:", error.message);
    // Show user-friendly error message
  }
}
```

## Webhooks

Webhook handlers are located in:
- `/app/api/payments/btcpay/webhook/route.ts`
- `/app/api/payments/shkeeper/webhook/route.ts`

Configure webhook URLs in your payment provider dashboards:
- BTCPay: `https://your-domain.com/api/payments/btcpay/webhook`
- Shkeeper: `https://your-domain.com/api/payments/shkeeper/webhook`

## Testing

### Test with Fake Provider

```typescript
// The fake provider is always available in development
const payment = await paymentManager.createPayment({
  providerId: "fake",
  orderId: "test_order",
  amount: 10.00,
  currency: "USD",
});

// Payment will auto-complete after 3 seconds
```

### Test with Real Providers

1. Configure environment variables
2. Restart application
3. Use test mode/testnet if available
4. Monitor webhook logs

## Best Practices

1. **Always validate provider availability** before creating payments
2. **Handle all payment statuses** (pending, processing, completed, failed, expired)
3. **Implement proper error handling** for all payment operations
4. **Use webhooks** for reliable payment confirmation
5. **Log all payment events** for debugging and audit trails
6. **Never expose API keys** in client-side code
7. **Implement timeout handling** for long-running payments
8. **Provide clear user feedback** during payment process

## Security Considerations

- API keys are server-side only (not in NEXT_PUBLIC_ variables)
- Webhook signature verification should be implemented in production
- All payment data should be validated before processing
- Use HTTPS for all payment-related endpoints
- Implement rate limiting on webhook endpoints

## Extending the System

To add a new payment provider:

1. Create a new provider file (e.g., `new-provider.ts`)
2. Implement the `PaymentProviderService` interface
3. Add provider to `payment-manager.ts`
4. Create webhook handler in `/app/api/payments/new-provider/webhook/`
5. Update documentation

Example:

```typescript
// new-provider.ts
export class NewProvider implements PaymentProviderService {
  async createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    // Implementation
  }
  
  async getPaymentStatus(paymentId: string): Promise<PaymentSession> {
    // Implementation
  }
  
  async isPaymentCompleted(paymentId: string): Promise<boolean> {
    // Implementation
  }
  
  async validateConfig(): Promise<boolean> {
    // Implementation
  }
}
```

## Support

For detailed setup instructions, see [`PAYMENT_SETUP_GUIDE.md`](../../../../../PAYMENT_SETUP_GUIDE.md)

For provider-specific issues:
- BTCPay: https://docs.btcpayserver.org/
- Shkeeper: https://shkeeper.io/docs