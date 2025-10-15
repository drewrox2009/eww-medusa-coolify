# Octochems Storefront Implementation Roadmap

This document provides a step-by-step implementation guide for transforming the current storefront into the science.bio-inspired design.

---

## Overview

**Goal:** Transform the current blue-themed pharmaceutical storefront into a minimal, monochromatic design inspired by science.bio, featuring the Octochems branding.

**Estimated Effort:** 8-12 hours of development time

**Key Files to Modify:**
- [`tailwind.config.ts`](tailwind.config.ts) - Color system and design tokens
- [`globals.css`](src/app/globals.css) - Global styles and utilities
- [`Header.tsx`](src/components/layout/Header.tsx) - Navigation component
- [`layout.tsx`](src/app/layout.tsx) - Footer and overall layout
- [`page.tsx`](src/app/page.tsx) - Homepage hero and sections
- Product components in [`src/components/product/`](src/components/product/)

---

## Phase 1: Foundation (2-3 hours)

### Step 1.1: Update Tailwind Configuration

**File:** [`tailwind.config.ts`](tailwind.config.ts:1)

**Changes:**
```typescript
// Replace the entire colors section with:
colors: {
  // Base colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Gray scale (primary palette)
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Accent colors (minimal use)
  teal: {
    400: '#2DD4BF',
  },
  cyan: {
    400: '#22D3EE',
  },
  
  // Keep for compatibility
  primary: {
    DEFAULT: '#000000',
    foreground: '#FFFFFF',
  },
}
```

**Update shadows:**
```typescript
boxShadow: {
  'subtle': '0 1px 2px rgba(0,0,0,0.05)',
  'card': '0 4px 6px rgba(0,0,0,0.07)',
  'elevated': '0 10px 15px rgba(0,0,0,0.1)',
  'floating': '0 20px 25px rgba(0,0,0,0.15)',
}
```

### Step 1.2: Update Global CSS

**File:** [`globals.css`](src/app/globals.css:1)

**Changes:**
```css
@layer base {
  :root {
    color-scheme: light;
  }

  body {
    background-color: #FFFFFF;
    color: #171717;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: #E5E5E5;
    color: #000000;
  }
}

@layer utilities {
  /* Update container-custom to be more minimal */
  .container-custom {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1280px; /* Wider for more whitespace */
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    .container-custom {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container-custom {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* Simplified card surface */
  .card-surface {
    border-radius: 0.5rem;
    border: 1px solid #E5E5E5;
    background-color: #FFFFFF;
  }

  /* Remove badge-soft, replace with minimal version */
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 0.25rem;
    background-color: #F5F5F5;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #000000;
  }

  /* Remove hero-surface gradient, use simple white */
  .hero-surface {
    background: #FFFFFF;
  }

  /* Add product card style */
  .product-card {
    background-color: #F5F5F5;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  }
}
```

### Step 1.3: Copy Logo Assets

**Files to copy:**
- [`octochems_hex.svg`](../octochems_hex.svg) → [`public/octochems-logo.svg`](public/octochems-logo.svg)
- Create white version for dark backgrounds

**Action:**
```bash
# Copy the logo
cp octochems_hex.svg front/public/octochems-logo.svg

# Create white version (invert colors in SVG)
# Change fill="#000000" to fill="#FFFFFF"
```

---

## Phase 2: Header Component (1-2 hours)

### Step 2.1: Update Header Component

**File:** [`Header.tsx`](src/components/layout/Header.tsx:1)

**Key Changes:**

1. **Replace logo:**
```tsx
<Image
  src="/octochems-logo.svg"
  alt="Octochems"
  width={160}
  height={48}
  className="h-12 w-auto"
  priority
/>
```

2. **Simplify header styling:**
```tsx
<header
  className={cn(
    "sticky top-0 z-50 w-full border-b transition-all duration-300",
    "backdrop-blur-sm",
    isScrolled
      ? "border-gray-200 bg-white/95 shadow-floating"
      : "border-transparent bg-white"
  )}
>
```

3. **Update navigation colors:**
```tsx
<Link
  href={item.href}
  className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
>
```

4. **Simplify buttons:**
```tsx
// Cart button
<Link
  href="/cart"
  className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-black hover:text-black"
>

// Sign in button
<Link
  href="/login"
  className="rounded-md border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-50"
>
```

---

## Phase 3: Footer Component (1 hour)

### Step 3.1: Update Footer in Layout

**File:** [`layout.tsx`](src/app/layout.tsx:46)

**Key Changes:**

1. **Dark background:**
```tsx
<footer className="bg-gray-800 text-gray-300">
```

2. **Simplify structure:**
```tsx
<div className="container-custom">
  <div className="border-b border-gray-700 py-16">
    {/* Logo and description */}
    <div className="mb-12">
      <Image
        src="/octochems-logo-white.svg"
        alt="Octochems"
        width={160}
        height={48}
        className="h-12 w-auto mb-4"
      />
      <p className="text-sm text-gray-400 max-w-xl">
        Research-grade chemical compounds for scientific exploration.
      </p>
    </div>

    {/* Footer columns */}
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      {/* Column content */}
    </div>
  </div>

  {/* Copyright */}
  <div className="py-8 text-xs text-gray-500">
    <p>&copy; {new Date().getFullYear()} Octochems. All rights reserved.</p>
  </div>
</div>
```

3. **Update link colors:**
```tsx
<Link
  href={link.href}
  className="text-gray-400 transition hover:text-white"
>
```

---

## Phase 4: Homepage Redesign (2-3 hours)

### Step 4.1: Update Hero Section

**File:** [`page.tsx`](src/app/page.tsx:104)

**Key Changes:**

1. **Simplify hero background:**
```tsx
<section className="section-padding bg-white">
```

2. **Remove colored badges:**
```tsx
<span className="badge">
  Licensed International Fulfillment
</span>
```

3. **Update heading styles:**
```tsx
<h1 className="text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
  Research-Grade Chemical Compounds
</h1>
<p className="max-w-xl text-lg text-gray-600">
  Premium nootropics and research chemicals for scientific exploration.
</p>
```

4. **Simplify buttons:**
```tsx
<Link
  href="/products"
  className="inline-flex items-center justify-center rounded-md bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
>
  Shop Catalog
</Link>
<Link
  href="/contact"
  className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-gray-50"
>
  Contact Support
</Link>
```

5. **Remove gradient overlays and complex styling from image container**

### Step 4.2: Update Trust Indicators Section

**Changes:**
```tsx
<section className="section-padding bg-gray-50">
  <div className="container-custom">
    <h2 className="text-3xl font-bold text-black mb-12">
      Why Choose Octochems
    </h2>
    
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {trustIndicators.map((item) => (
        <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 mb-4">
            <Icon className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Step 4.3: Update Categories Section

**Changes:**
```tsx
<section className="section-padding bg-white">
  <div className="container-custom">
    <h2 className="text-3xl font-bold text-black mb-12">
      Product Categories
    </h2>
    
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="group border border-gray-200 rounded-lg p-8 transition hover:border-black"
        >
          <h3 className="text-xl font-semibold text-black mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {category.description}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-black">
            View products
            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  </div>
</section>
```

---

## Phase 5: Product Components (2 hours)

### Step 5.1: Update ProductCard Component

**File:** [`ProductCard.tsx`](src/components/product/ProductCard.tsx:1)

**Complete rewrite:**
```tsx
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="product-card group"
    >
      {/* Product image */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-white">
        <Image
          src={product.thumbnail || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-black line-clamp-2">
          {product.title}
        </h3>
        
        {product.collection && (
          <p className="text-sm text-gray-500">
            {product.collection.title}
          </p>
        )}
        
        <p className="text-lg font-bold text-black">
          ${product.variants[0]?.prices[0]?.amount / 100}
        </p>
      </div>
    </Link>
  );
}
```

### Step 5.2: Update AddToCartButton Component

**File:** [`AddToCartButton.tsx`](src/components/product/AddToCartButton.tsx:1)

**Simplify styling:**
```tsx
<button
  onClick={handleAddToCart}
  disabled={isLoading}
  className="w-full rounded-md bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
>
  {isLoading ? 'Adding...' : 'Add to Cart'}
</button>
```

### Step 5.3: Update ProductFilters Component

**File:** [`ProductFilters.tsx`](src/components/product/ProductFilters.tsx:1)

**Simplify styling:**
```tsx
<div className="space-y-6">
  <div>
    <h3 className="text-sm font-semibold text-black mb-3">
      Categories
    </h3>
    <div className="space-y-2">
      {categories.map((category) => (
        <label key={category.id} className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="ml-2 text-sm text-gray-600">
            {category.name}
          </span>
        </label>
      ))}
    </div>
  </div>
</div>
```

---

## Phase 6: Product Pages (1-2 hours)

### Step 6.1: Update Product Detail Page

**File:** [`products/[handle]/page.tsx`](src/app/products/[handle]/page.tsx:1)

**Key Changes:**

1. **Simplify layout:**
```tsx
<div className="container-custom py-12">
  <div className="grid gap-12 lg:grid-cols-2">
    {/* Image gallery */}
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={600}
          height={600}
          className="object-cover"
        />
      </div>
    </div>

    {/* Product info */}
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-2">
          {product.collection?.title}
        </p>
        <h1 className="text-3xl font-bold text-black">
          {product.title}
        </h1>
      </div>

      <p className="text-2xl font-bold text-black">
        ${product.variants[0]?.prices[0]?.amount / 100}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle2 className="h-4 w-4 mr-2 text-black" />
          Lab tested with COA
        </li>
        {/* More features */}
      </ul>

      {/* Add to cart */}
      <AddToCartButton product={product} />
    </div>
  </div>
</div>
```

### Step 6.2: Update Products Listing Page

**File:** [`products/page.tsx`](src/app/products/page.tsx:1)

**Key Changes:**

1. **Simplify header:**
```tsx
<div className="border-b border-gray-200 bg-white">
  <div className="container-custom py-8">
    <h1 className="text-3xl font-bold text-black">
      All Products
    </h1>
  </div>
</div>
```

2. **Update grid:**
```tsx
<div className="container-custom py-12">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</div>
```

---

## Phase 7: Checkout Flow (1-2 hours)

### Step 7.1: Update Cart Page

**File:** [`cart/page.tsx`](src/app/cart/page.tsx:1)

**Simplify styling to match science.bio checkout**

### Step 7.2: Update Checkout Pages

**File:** [`checkout/page.tsx`](src/app/checkout/page.tsx:1)

**Key Changes:**

1. **Add breadcrumb:**
```tsx
<div className="border-b border-gray-200 bg-white">
  <div className="container-custom py-4">
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Cart</span>
      <span className="text-gray-400">›</span>
      <span className="font-medium text-black">Information</span>
      <span className="text-gray-400">›</span>
      <span className="text-gray-400">Shipping</span>
      <span className="text-gray-400">›</span>
      <span className="text-gray-400">Payment</span>
    </div>
  </div>
</div>
```

2. **Simplify form styling:**
```tsx
<input
  type="email"
  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
  placeholder="Email address"
/>
```

---

## Phase 8: Polish & Testing (1-2 hours)

### Step 8.1: Remove Unused Styles

- Remove all blue color references
- Remove gradient utilities
- Remove complex shadow utilities
- Clean up unused CSS classes

### Step 8.2: Test Responsive Design

**Test on:**
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Large desktop (1920px)

**Check:**
- Navigation collapse
- Product grid columns
- Image aspect ratios
- Button sizes
- Form layouts

### Step 8.3: Accessibility Audit

**Verify:**
- Color contrast ratios
- Focus states on all interactive elements
- Keyboard navigation
- Screen reader labels
- Touch target sizes (44px minimum)

### Step 8.4: Performance Check

**Optimize:**
- Image sizes and formats
- Remove unused CSS
- Minimize JavaScript bundles
- Test page load times

---

## Testing Checklist

### Visual Testing
- [ ] Header displays correctly on all pages
- [ ] Footer displays correctly on all pages
- [ ] Logo is visible and correct
- [ ] All buttons have correct styling
- [ ] Product cards match design
- [ ] Forms are properly styled
- [ ] Colors match the palette
- [ ] Typography is consistent

### Functional Testing
- [ ] Navigation works on all devices
- [ ] Mobile menu opens/closes
- [ ] Product filtering works
- [ ] Add to cart functions
- [ ] Checkout flow completes
- [ ] Forms validate correctly
- [ ] Links navigate properly

### Responsive Testing
- [ ] Mobile layout (< 640px)
- [ ] Tablet layout (640-1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Images scale properly
- [ ] Text is readable at all sizes
- [ ] Buttons are tappable on mobile

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## File Modification Summary

### High Priority (Must Change)
1. ✅ [`tailwind.config.ts`](tailwind.config.ts) - Color system
2. ✅ [`globals.css`](src/app/globals.css) - Global styles
3. ✅ [`Header.tsx`](src/components/layout/Header.tsx) - Navigation
4. ✅ [`layout.tsx`](src/app/layout.tsx) - Footer
5. ✅ [`page.tsx`](src/app/page.tsx) - Homepage

### Medium Priority (Should Change)
6. ✅ [`ProductCard.tsx`](src/components/product/ProductCard.tsx)
7. ✅ [`AddToCartButton.tsx`](src/components/product/AddToCartButton.tsx)
8. ✅ [`products/[handle]/page.tsx`](src/app/products/[handle]/page.tsx)
9. ✅ [`products/page.tsx`](src/app/products/page.tsx)
10. ✅ [`cart/page.tsx`](src/app/cart/page.tsx)

### Low Priority (Nice to Have)
11. ⚪ [`checkout/page.tsx`](src/app/checkout/page.tsx)
12. ⚪ [`about/page.tsx`](src/app/about/page.tsx)
13. ⚪ [`contact/page.tsx`](src/app/contact/page.tsx)
14. ⚪ Other utility components

---

## Success Criteria

The redesign is complete when:

1. ✅ All colors match the monochromatic palette
2. ✅ Octochems logo is displayed throughout
3. ✅ Product cards match science.bio style
4. ✅ Navigation is minimal and clean
5. ✅ Footer has dark background with organized columns
6. ✅ All gradients and heavy shadows are removed
7. ✅ Typography is clean and consistent
8. ✅ Responsive design works on all devices
9. ✅ All functionality still works
10. ✅ Site loads quickly and performs well

---

## Notes for Implementation

- **Preserve functionality:** Don't break existing features
- **Test incrementally:** Test after each phase
- **Keep backups:** Commit changes frequently
- **Mobile first:** Start with mobile layouts
- **Accessibility:** Maintain WCAG AA compliance
- **Performance:** Don't add unnecessary code
