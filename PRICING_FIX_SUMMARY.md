# Pricing Display Fix Summary

## Issue Identified
Products were displaying "N/A" instead of actual prices on both the `/products` page and individual product pages. The browser console showed multiple 400 errors when fetching product data.

## Root Cause
The Medusa v2 API requires a `region_id` parameter to calculate and return pricing information. Without this parameter, the API returns products but with `calculated_price: null` for all variants. The frontend was not passing the region_id, so no pricing data was being returned.

## Changes Made

### 1. Fixed API Calls (`front/src/lib/medusa/products.ts`)
- **Added** region fetching functionality with caching to avoid repeated API calls
- **Added** `region_id` parameter to all product list queries (`getProducts()`, `getProduct()`, `searchProducts()`)
- The Medusa v2 API requires the region_id to calculate pricing based on the region's currency and tax settings

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
- **Issue**: Missing `region_id` parameter in product queries prevented pricing calculation

### Pricing Structure in Medusa v2
```typescript
// Without region_id:
product.variants[0].calculated_price // null

// With region_id:
product.variants[0].calculated_price.calculated_amount // 4500 (in cents)

// API Query Example:
medusa.store.product.list({
  region_id: "reg_01K7NVAHACXM4T08J1X5RE14TD"
})
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
- [ ] Products page displays prices correctly (e.g., $0.45 for 1g Imidanezil)
- [ ] Individual product pages show prices
- [ ] No 400 errors in browser console
- [ ] Price formatting is correct (currency symbol, decimals)
- [ ] "N/A" only shows for products without pricing data
- [ ] Prices update correctly when changing variants

## Expected Result
After deployment:
- Products will display actual prices (e.g., $0.45, $2.25, $5.50) instead of "N/A"
- Prices are calculated based on the USD region
- Proper price display on both listing and detail pages
- Variant selector shows correct prices for each quantity option

## API Response Example
With the fix, the API now returns:
```json
{
  "variants": [{
    "calculated_price": {
      "calculated_amount": 45,
      "currency_code": "usd"
    }
  }]
}
```