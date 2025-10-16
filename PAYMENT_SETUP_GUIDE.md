# Payment Integration Setup Guide

This guide explains how to configure and use the three payment options available in the application.

## Overview

The application supports three payment providers:

1. **Fake/Test Provider** - For development and testing (no setup required)
2. **BTCPay Server** - Bitcoin and Lightning Network payments
3. **Shkeeper** - Multi-cryptocurrency payment gateway

## Payment Provider Details

### 1. Fake/Test Provider

**Purpose**: Development and testing without real transactions

**Features**:
- Auto-completes payments after 3 seconds
- Simulates payment flow
- No configuration required
- Always enabled in development

**Usage**:
- Select "Test Payment (Fake)" during checkout
- Payment will automatically complete after a short delay
- Perfect for testing the checkout flow

---

### 2. BTCPay Server Integration

**Purpose**: Accept Bitcoin and Lightning Network payments

**Supported Currencies**: BTC, Lightning Network

**Setup Requirements**:

1. **BTCPay Server Instance**
   - Self-hosted or use a third-party host
   - Create a store in your BTCPay Server dashboard

2. **Environment Variables**:
   ```env
   # BTCPay Server Configuration
   NEXT_PUBLIC_BTCPAY_SERVER_URL=https://your-btcpay-server.com
   BTCPAY_API_KEY=your_api_key_here
   BTCPAY_STORE_ID=your_store_id_here
   BTCPAY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

3. **Getting API Credentials**:
   - Log into your BTCPay Server
   - Go to Store Settings → Access Tokens
   - Create a new API key with permissions:
     - `btcpay.store.canviewinvoices`
     - `btcpay.store.cancreateinvoice`
   - Copy the API key and Store ID

4. **Webhook Configuration**:
   - In BTCPay Server, go to Store Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/payments/btcpay/webhook`
   - Select events: `InvoiceSettled`, `InvoiceProcessing`, `InvoiceExpired`, `InvoiceInvalid`
   - Save the webhook secret

**Testing**:
```bash
# Test BTCPay connection
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://your-btcpay-server.com/api/v1/stores/YOUR_STORE_ID
```

**Features**:
- On-chain Bitcoin payments
- Lightning Network support
- No KYC required
- Self-custodial
- Privacy-focused

---

### 3. Shkeeper Integration

**Purpose**: Multi-cryptocurrency payment gateway

**Supported Currencies**: BTC, ETH, LTC, USDT, USDC, BCH, DOGE, XMR, TRX, and more

**Setup Requirements**:

1. **Shkeeper Account**
   - Sign up at [Shkeeper.io](https://shkeeper.io)
   - Create a wallet for receiving payments

2. **Environment Variables**:
   ```env
   # Shkeeper Configuration
   NEXT_PUBLIC_SHKEEPER_API_URL=https://api.shkeeper.io
   SHKEEPER_API_KEY=your_api_key_here
   SHKEEPER_SECRET_KEY=your_secret_key_here
   SHKEEPER_WALLET_ID=your_wallet_id_here
   SHKEEPER_CALLBACK_URL=https://your-domain.com/api/payments/shkeeper/webhook
   ```

3. **Getting API Credentials**:
   - Log into Shkeeper dashboard
   - Go to Settings → API Keys
   - Generate a new API key
   - Copy the API key and secret key
   - Note your wallet ID from the Wallets section

4. **Webhook Configuration**:
   - In Shkeeper dashboard, go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/payments/shkeeper/webhook`
   - Enable events: `payment.confirmed`, `payment.received`, `payment.expired`
   - Save the configuration

**Testing**:
```bash
# Test Shkeeper connection
curl -H "X-Shkeeper-API-Key: YOUR_API_KEY" \
  https://api.shkeeper.io/api/v1/status
```

**Features**:
- Multiple cryptocurrencies
- Automatic conversion
- Low fees
- Fast confirmations
- API-first design

---

## Environment Variables Template

Create a `.env` file in the `front/` directory with the following:

```env
# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# BTCPay Server (Optional - leave empty to disable)
NEXT_PUBLIC_BTCPAY_SERVER_URL=
BTCPAY_API_KEY=
BTCPAY_STORE_ID=
BTCPAY_WEBHOOK_SECRET=

# Shkeeper (Optional - leave empty to disable)
NEXT_PUBLIC_SHKEEPER_API_URL=https://api.shkeeper.io
SHKEEPER_API_KEY=
SHKEEPER_SECRET_KEY=
SHKEEPER_WALLET_ID=
SHKEEPER_CALLBACK_URL=
```

## Payment Flow

### User Journey

1. **Add items to cart**
2. **Proceed to checkout**
3. **Enter shipping information**
4. **Select payment method**:
   - Fake/Test (development only)
   - Bitcoin/Lightning (BTCPay)
   - Multi-crypto (Shkeeper)
5. **Complete payment**:
   - For fake: Auto-completes in 3 seconds
   - For BTCPay: Redirects to BTCPay checkout
   - For Shkeeper: Redirects to Shkeeper payment page
6. **Payment confirmation**
7. **Order completion**

### Technical Flow

```
Cart → Checkout → Payment Provider → Payment Page → Webhook → Order Confirmation
```

## Webhook Endpoints

The application provides webhook endpoints for payment notifications:

- **BTCPay**: `/api/payments/btcpay/webhook`
- **Shkeeper**: `/api/payments/shkeeper/webhook`

### Webhook Security

In production, implement proper webhook signature verification:

1. **BTCPay**: Verify `btcpay-sig` header
2. **Shkeeper**: Verify `x-shkeeper-signature` header

Example verification (to be implemented):
```typescript
// In webhook handler
const signature = request.headers.get("x-provider-signature");
const isValid = verifySignature(body, signature, secret);
if (!isValid) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

## Testing

### Test with Fake Provider

1. Add items to cart
2. Go to checkout
3. Select "Test Payment (Fake)"
4. Click "Complete Order"
5. Payment will auto-complete in 3 seconds

### Test with Real Providers

1. Configure environment variables
2. Restart the application
3. Verify provider appears in checkout
4. Complete a test transaction
5. Check webhook logs for confirmation

## Troubleshooting

### Provider Not Showing

**Issue**: Payment provider doesn't appear in checkout

**Solutions**:
- Check environment variables are set correctly
- Restart the application after adding variables
- Verify API credentials are valid
- Check console for error messages

### Payment Not Completing

**Issue**: Payment stuck in pending state

**Solutions**:
- Check webhook configuration
- Verify webhook URL is accessible
- Check webhook logs in provider dashboard
- Ensure proper HTTPS configuration

### API Connection Errors

**Issue**: Cannot connect to payment provider API

**Solutions**:
- Verify API URL is correct
- Check API key permissions
- Test API connection with curl
- Check firewall/network settings

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Implement webhook signature verification** in production
4. **Use HTTPS** for all webhook endpoints
5. **Validate all webhook payloads** before processing
6. **Log all payment events** for audit trail
7. **Implement rate limiting** on webhook endpoints
8. **Monitor for suspicious activity**

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Webhook endpoints tested
- [ ] Webhook signature verification implemented
- [ ] HTTPS enabled on all endpoints
- [ ] Payment flow tested end-to-end
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup payment method available
- [ ] Customer support process defined

## Support

For issues with:
- **BTCPay Server**: [BTCPay Documentation](https://docs.btcpayserver.org/)
- **Shkeeper**: [Shkeeper Support](https://shkeeper.io/support)
- **Application**: Check application logs and console errors

## Additional Resources

- [BTCPay Server API Documentation](https://docs.btcpayserver.org/API/Greenfield/v1/)
- [Shkeeper API Documentation](https://shkeeper.io/docs/api)
- [Medusa Payment Providers](https://docs.medusajs.com/modules/carts-and-checkout/payment)