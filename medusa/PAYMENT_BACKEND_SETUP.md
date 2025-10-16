# Medusa Backend Payment Configuration

## Overview

The Medusa backend has been configured with a manual payment provider that works with the frontend payment system.

## What Was Added

### 1. Manual Payment Provider Module

**Location**: `medusa/src/modules/payment-manual/`

This module provides a simple payment provider for testing and development:

- **`index.ts`** - Module registration
- **`service.ts`** - Payment provider service implementation

### 2. Updated Medusa Configuration

**File**: `medusa/medusa-config.ts`

Added payment module configuration:

```typescript
{
  resolve: "@medusajs/medusa/payment",
  options: {
    providers: [
      {
        resolve: "./src/modules/payment-manual",
        id: "manual",
        options: {
          name: "Manual Payment (Test/Development)",
        },
      },
    ],
  },
}
```

## How It Works

### Payment Flow

1. **Frontend** creates payment session via payment manager
2. **Medusa Backend** handles cart and order management
3. **Manual Provider** processes payment (auto-approves for testing)
4. **Frontend** receives confirmation and completes order

### Integration with Frontend

The frontend payment system (`front/src/lib/payments/`) works independently but can integrate with Medusa's payment system:

- **Fake Provider** (frontend) - For quick testing without backend
- **Manual Provider** (backend) - For testing with full Medusa integration
- **BTCPay/Shkeeper** (frontend) - For real cryptocurrency payments

## Environment Variables

No additional environment variables needed for the manual provider. It's configured to work out of the box.

## Testing

### 1. Start Medusa Backend

```bash
cd medusa
yarn dev
```

### 2. Verify Payment Provider

The manual payment provider should be available at:
- Admin API: `http://localhost:9000/admin/payment-providers`
- Store API: `http://localhost:9000/store/payment-providers`

### 3. Test Payment Flow

1. Add items to cart via frontend
2. Proceed to checkout
3. Select payment method
4. Complete order

## Adding Real Payment Providers

### For BTCPay Server

You would need to create a Medusa payment provider module:

```typescript
// medusa/src/modules/payment-btcpay/service.ts
class BTCPayPaymentProviderService extends AbstractPaymentProvider {
  static identifier = "btcpay";
  
  async initiatePayment(context: any) {
    // Create BTCPay invoice
    // Return payment session data
  }
  
  // Implement other required methods...
}
```

Then add to `medusa-config.ts`:

```typescript
{
  resolve: "./src/modules/payment-btcpay",
  id: "btcpay",
  options: {
    serverUrl: process.env.BTCPAY_SERVER_URL,
    apiKey: process.env.BTCPAY_API_KEY,
    storeId: process.env.BTCPAY_STORE_ID,
  },
}
```

### For Shkeeper

Similar approach:

```typescript
// medusa/src/modules/payment-shkeeper/service.ts
class ShkeeperPaymentProviderService extends AbstractPaymentProvider {
  static identifier = "shkeeper";
  
  async initiatePayment(context: any) {
    // Create Shkeeper invoice
    // Return payment session data
  }
  
  // Implement other required methods...
}
```

## Current Architecture

### Hybrid Approach

The current implementation uses a **hybrid architecture**:

1. **Frontend Payment Providers** (`front/src/lib/payments/`)
   - Handle cryptocurrency payment creation
   - Manage payment sessions
   - Process webhooks
   - Provide UI for payment status

2. **Medusa Backend** (`medusa/`)
   - Manages carts and orders
   - Handles inventory
   - Processes order completion
   - Sends notifications

### Why This Approach?

- **Flexibility**: Can use any payment provider without Medusa plugin
- **Speed**: Faster development and testing
- **Control**: Full control over payment flow and UI
- **Compatibility**: Works with providers that don't have Medusa plugins

### Alternative: Full Medusa Integration

For production, you might want to create full Medusa payment provider plugins:

**Advantages**:
- Tighter integration with Medusa
- Automatic order status updates
- Built-in webhook handling
- Admin dashboard integration

**Disadvantages**:
- More complex to implement
- Requires Medusa plugin development
- Less flexibility for custom flows

## Recommendations

### For Development/Testing
✅ Use current hybrid approach with fake provider

### For Production

**Option 1: Keep Hybrid (Recommended for now)**
- Frontend handles payment provider integration
- Medusa handles order management
- Implement proper webhook → order status sync

**Option 2: Full Medusa Integration**
- Create Medusa payment provider plugins for BTCPay and Shkeeper
- Move all payment logic to backend
- Use Medusa's built-in payment flow

## Migration Path

If you want to move to full Medusa integration later:

1. Create payment provider modules in `medusa/src/modules/`
2. Implement `AbstractPaymentProvider` interface
3. Add providers to `medusa-config.ts`
4. Update frontend to use Medusa payment APIs
5. Remove standalone payment providers from frontend

## Resources

- [Medusa Payment Providers Documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Creating Custom Payment Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/page)
- [Payment Module Reference](https://docs.medusajs.com/resources/commerce-modules/payment)

## Support

For issues:
- Check Medusa logs: `medusa/logs/`
- Verify payment provider is loaded: Check startup logs
- Test payment endpoints: Use Medusa admin or API directly