# Pricing Display Fix Summary

## Issue Identified
Products were displaying "N/A" instead of actual prices on both the `/products` page and individual product pages. The browser console showed multiple 400 errors when fetching product data.

## Root Cause
The frontend was using an invalid `fields: "+variants.prices"` parameter in the Medusa API calls, which was causing 400 Bad Request errors. This parameter syntax is not compatible with Medusa v2.8.8.

## Changes Made

### 1. Fixed API Calls (`front/src/lib/medusa/products.ts`)
- **Removed** the problematic `fields: "+variants.prices"` parameter from `getProducts()` function
- **Removed** the problematic `fields: "+variants.prices"` parameter from `getProduct()` function
- The Medusa v2 API automatically includes pricing data in the response without needing explicit field selection

### 2. Updated Price Access (`front/src/components/product/ProductCard.tsx`)
- **Changed** price access from `product.variants?.[0]?.prices?.[0]?.amount`
- **To** `product.variants?.[0]?.calculated_price?.calculated_amount`
- This matches the Medusa v2 pricing structure where prices are pre-calculated

### 3. Product Detail Page
- **No changes needed** - Already using the correct `calculated_price.calculated_amount` path

## Technical Details

### Medusa Version Compatibility
- **Backend**: Medusa v2.8.8
- **Frontend SDK**: @medusajs/js-sdk v2.10.3
- **Issue**: The `fields` parameter syntax used was incompatible with the backend version

### Pricing Structure in Medusa v2
```typescript
// Old (incorrect) structure:
product.variants[0].prices[0].amount

// New (correct) structure:
product.variants[0].calculated_price.calculated_amount
```

## Deployment Notes

### For Coolify Deployment
1. The changes are in the frontend code only
2. No environment variable changes needed
3. Simply rebuild and redeploy the frontend service
4. The backend (Medusa) requires no changes

### Environment Variables (Already Set)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

## Testing Checklist
- [ ] Products page displays prices correctly
- [ ] Individual product pages show prices
- [ ] No 400 errors in browser console
- [ ] Price formatting is correct (currency symbol, decimals)
- [ ] "N/A" only shows for products without pricing data

## Expected Result
After deployment:
- Products will display actual prices instead of "N/A"
- No more 400 errors in the console
- Faster page loads (no failed API requests)
- Proper price display on both listing and detail pages