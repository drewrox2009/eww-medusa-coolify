# Payment System Testing Guide

## Overview

This guide provides step-by-step instructions for testing the payment system with all three providers.

## Prerequisites

### Required Software
- Node.js 20+ installed
- npm or yarn package manager
- Git (for version control)

### Environment Setup

1. **Frontend Environment** (`front/.env`):
```env
# Application URL (required for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# BTCPay Server (optional - for testing BTCPay)
NEXT_PUBLIC_BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_API_KEY=your_api_key_here
BTCPAY_STORE_ID=your_store_id_here
BTCPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Shkeeper (optional - for testing Shkeeper)
NEXT_PUBLIC_SHKEEPER_API_URL=https://api.shkeeper.io
SHKEEPER_API_KEY=your_api_key_here
SHKEEPER_SECRET_KEY=your_secret_key_here
SHKEEPER_WALLET_ID=your_wallet_id_here
```

2. **Backend Environment** (`medusa/.env`):
```env
# Database and Redis (required)
DATABASE_URL=postgresql://user:password@localhost:5432/medusa
REDIS_URL=redis://localhost:6379

# CORS settings
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000,http://localhost:7001

# Secrets
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

## Test Scenarios

### Scenario 1: Fake Provider (No Setup Required)

**Purpose**: Test the complete checkout flow without external dependencies

**Steps**:

1. **Start Frontend**:
```bash
cd front
npm install
npm run dev
```

2. **Navigate to Store**:
   - Open http://localhost:3000
   - Browse products
   - Add items to cart

3. **Proceed to Checkout**:
   - Click cart icon
   - Click "Proceed to secure checkout"
   - Fill in shipping information
   - Click "Continue to Payment"

4. **Select Fake Provider**:
   - You should see "Test Payment (Fake)" with a yellow "Test" badge
   - Select this option
   - Click "Complete Order"

5. **Verify Auto-Completion**:
   - Payment should auto-complete in 3 seconds
   - You'll be redirected to confirmation page
   - Check browser console for payment logs

**Expected Results**:
- ✅ Payment completes automatically
- ✅ Order confirmation displayed
- ✅ Cart is cleared
- ✅ No errors in console

---

### Scenario 2: BTCPay Server Integration

**Purpose**: Test Bitcoin/Lightning Network payments

**Prerequisites**:
- BTCPay Server instance (self-hosted or third-party)
- API key with invoice permissions
- Store ID
- Webhook secret configured

**Steps**:

1. **Configure BTCPay**:
   - Add BTCPay credentials to `front/.env`
   - Restart frontend: `npm run dev`

2. **Verify Provider Appears**:
   - Go to checkout
   - Confirm "Bitcoin & Lightning" option is visible
   - Should show Bitcoin icon

3. **Create Payment**:
   - Select "Bitcoin & Lightning"
   - Click "Complete Order"
   - Should redirect to BTCPay checkout page

4. **Complete Payment**:
   - On BTCPay page, choose payment method (BTC or Lightning)
   - Complete payment (use testnet for testing)
   - BTCPay will redirect back to your site

5. **Verify Webhook**:
   - Check webhook endpoint: http://localhost:3000/api/payments/btcpay/webhook
   - Verify webhook logs in console
   - Confirm signature verification passed

**Expected Results**:
- ✅ BTCPay checkout page loads
- ✅ Payment can be completed
- ✅ Webhook receives notification
- ✅ Signature verification succeeds
- ✅ Order status updates

**Testing Webhook Locally**:

Use ngrok to expose local server:
```bash
ngrok http 3000
```

Configure BTCPay webhook URL:
```
https://your-ngrok-url.ngrok.io/api/payments/btcpay/webhook
```

---

### Scenario 3: Shkeeper Integration

**Purpose**: Test multi-cryptocurrency payments

**Prerequisites**:
- Shkeeper account
- API key and secret key
- Wallet ID
- Webhook configured

**Steps**:

1. **Configure Shkeeper**:
   - Add Shkeeper credentials to `front/.env`
   - Restart frontend: `npm run dev`

2. **Verify Provider Appears**:
   - Go to checkout
   - Confirm "Shkeeper Multi-Crypto" option is visible
   - Should show supported currencies (BTC, ETH, LTC, etc.)

3. **Create Payment**:
   - Select "Shkeeper Multi-Crypto"
   - Click "Complete Order"
   - Should redirect to Shkeeper payment page

4. **Complete Payment**:
   - Choose cryptocurrency
   - Send payment to provided address
   - Wait for confirmation

5. **Verify Webhook**:
   - Check webhook endpoint: http://localhost:3000/api/payments/shkeeper/webhook
   - Verify webhook logs in console
   - Confirm signature verification passed

**Expected Results**:
- ✅ Shkeeper payment page loads
- ✅ Multiple crypto options available
- ✅ Payment address displayed
- ✅ Webhook receives notification
- ✅ Signature verification succeeds
- ✅ Order status updates

**Testing Webhook Locally**:

Use ngrok:
```bash
ngrok http 3000
```

Configure Shkeeper webhook URL:
```
https://your-ngrok-url.ngrok.io/api/payments/shkeeper/webhook
```

---

## Testing Checklist

### Frontend Tests

- [ ] All three providers appear in checkout (when configured)
- [ ] Provider selection works correctly
- [ ] Payment buttons are clickable
- [ ] Loading states display properly
- [ ] Error messages are user-friendly
- [ ] Success redirects work
- [ ] Cart clears after successful payment

### Payment Flow Tests

- [ ] Fake provider auto-completes
- [ ] BTCPay redirects to checkout
- [ ] Shkeeper redirects to payment page
- [ ] Payment status page displays correctly
- [ ] QR codes render (if applicable)
- [ ] Copy-to-clipboard works for addresses
- [ ] Expiration timers work
- [ ] Auto-refresh on status changes

### Webhook Tests

- [ ] BTCPay webhook receives notifications
- [ ] BTCPay signature verification passes
- [ ] Shkeeper webhook receives notifications
- [ ] Shkeeper signature verification passes
- [ ] Webhook errors are logged
- [ ] Invalid signatures are rejected
- [ ] Missing secrets are handled gracefully

### Security Tests

- [ ] API keys not exposed in client code
- [ ] Webhook signatures verified
- [ ] HTTPS enforced (in production)
- [ ] No sensitive data in logs
- [ ] Rate limiting works (if implemented)

### Error Handling Tests

- [ ] Invalid payment provider handled
- [ ] Network errors display messages
- [ ] Expired payments handled
- [ ] Failed payments allow retry
- [ ] Missing configuration detected

---

## Debugging

### Check Provider Configuration

```bash
# Frontend
curl http://localhost:3000/api/payments/btcpay/webhook
curl http://localhost:3000/api/payments/shkeeper/webhook
```

Expected response:
```json
{
  "service": "BTCPay Webhook Handler",
  "status": "active",
  "configured": true
}
```

### View Payment Logs

**Browser Console**:
- Open DevTools (F12)
- Check Console tab for payment logs
- Look for `[Payment]` or `[Webhook]` prefixes

**Server Logs**:
```bash
# Frontend
cd front
npm run dev
# Watch console output

# Backend
cd medusa
yarn dev
# Watch console output
```

### Test Webhook Signature

```javascript
// In browser console
const crypto = require('crypto');
const payload = '{"test": "data"}';
const secret = 'your_secret';
const hmac = crypto.createHmac('sha256', secret);
hmac.update(payload);
console.log(hmac.digest('hex'));
```

### Common Issues

**Issue**: Provider not appearing in checkout
- **Solution**: Check environment variables are set
- **Solution**: Restart frontend after adding variables
- **Solution**: Verify API credentials are valid

**Issue**: Webhook not receiving notifications
- **Solution**: Use ngrok for local testing
- **Solution**: Check webhook URL in provider dashboard
- **Solution**: Verify HTTPS is used (required by most providers)

**Issue**: Signature verification failing
- **Solution**: Check webhook secret matches
- **Solution**: Verify payload format is correct
- **Solution**: Check for extra whitespace in secrets

**Issue**: Payment stuck in pending
- **Solution**: Check webhook is configured
- **Solution**: Verify webhook endpoint is accessible
- **Solution**: Check provider dashboard for errors

---

## Performance Testing

### Load Testing

Test with multiple concurrent payments:

```bash
# Install artillery
npm install -g artillery

# Create test script (artillery-test.yml)
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 5

scenarios:
  - name: "Checkout Flow"
    flow:
      - get:
          url: "/products"
      - post:
          url: "/api/cart/add"
          json:
            productId: "test_product"
            quantity: 1
      - get:
          url: "/checkout"

# Run test
artillery run artillery-test.yml
```

### Monitoring

Monitor key metrics:
- Payment creation time
- Webhook response time
- Database query performance
- API response times

---

## Production Testing

### Pre-Production Checklist

- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] Webhook URLs use production domain
- [ ] API keys are production keys (not test)
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Backup payment method available

### Test in Production

1. **Small Test Transaction**:
   - Use minimum amount
   - Complete full flow
   - Verify webhook delivery
   - Check order status

2. **Monitor for 24 Hours**:
   - Watch error logs
   - Check webhook success rate
   - Monitor payment completion rate
   - Review customer feedback

3. **Gradual Rollout**:
   - Enable for 10% of users
   - Monitor metrics
   - Increase to 50%
   - Full rollout after validation

---

## Support

### Getting Help

- Check logs first
- Review documentation
- Test with fake provider
- Verify configuration
- Check provider status pages

### Reporting Issues

Include:
- Environment (dev/staging/production)
- Provider being used
- Steps to reproduce
- Error messages
- Console logs
- Network requests (from DevTools)

---

## Next Steps

After successful testing:

1. **Implement Order Status Sync**:
   - Connect webhooks to database
   - Update order statuses
   - Send confirmation emails

2. **Add Monitoring**:
   - Set up error tracking (Sentry, etc.)
   - Configure uptime monitoring
   - Add payment analytics

3. **Enhance Security**:
   - Implement rate limiting
   - Add request validation
   - Set up fraud detection

4. **Optimize Performance**:
   - Cache provider configurations
   - Optimize database queries
   - Add CDN for static assets

5. **Improve UX**:
   - Add payment history
   - Implement refunds
   - Add email notifications
   - Create admin dashboard