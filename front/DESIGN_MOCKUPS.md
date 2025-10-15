# Octochems Storefront Design Mockups

## Design Philosophy

Inspired by science.bio's minimal aesthetic, the Octochems redesign focuses on:
- **Clean, monochromatic palette** (black, white, grays)
- **Generous whitespace** for breathing room
- **Product-focused layouts** with minimal distractions
- **Scientific credibility** through professional presentation
- **Easy navigation** with clear hierarchy

---

## Color Palette

```
Primary Colors:
├─ Black:     #000000  (Logo, text, primary buttons)
├─ White:     #FFFFFF  (Backgrounds, button text)
└─ Gray-50:   #FAFAFA  (Subtle backgrounds)

Gray Scale:
├─ Gray-100:  #F5F5F5  (Product card backgrounds)
├─ Gray-200:  #E5E5E5  (Borders, dividers)
├─ Gray-300:  #D4D4D4  (Disabled states)
├─ Gray-400:  #A3A3A3  (Secondary text)
├─ Gray-600:  #525252  (Body text)
├─ Gray-800:  #262626  (Footer background)
└─ Gray-900:  #171717  (Dark footer)

Accent Colors (from product imagery):
├─ Teal:      #2DD4BF  (Watercolor accents)
├─ Cyan:      #22D3EE  (Watercolor accents)
└─ Blue:      #60A5FA  (Watercolor accents)
```

---

## 1. Header Component

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [OCTOCHEMS LOGO]    Category  Type  Form  Feature  Contact    🔍 🛒 👤 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Height:** 80px
- **Background:** White (#FFFFFF)
- **Border:** 1px solid #E5E5E5 (bottom only)
- **Logo:** Octochems hexagon + text (height: 48px)
- **Navigation:** 
  - Font: Inter, 14px, Medium (500)
  - Color: #525252
  - Hover: #000000
  - Spacing: 32px between items
- **Icons:** 
  - Size: 20px
  - Color: #525252
  - Hover: #000000
  - Cart badge: Black circle with white text
- **Sticky:** Yes, with subtle shadow on scroll

---

## 2. Homepage Hero Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌──────────────────────────┐  ┌────────────────────────────────────┐  │
│  │                          │  │                                    │  │
│  │  Research-Grade          │  │                                    │  │
│  │  Chemical Compounds      │  │         [HERO IMAGE]               │  │
│  │                          │  │      Product Photography           │  │
│  │  Premium nootropics and  │  │    with watercolor accents         │  │
│  │  research chemicals for  │  │                                    │  │
│  │  scientific exploration  │  │                                    │  │
│  │                          │  │                                    │  │
│  │  [Shop Catalog]          │  │                                    │  │
│  │  [Learn More]            │  │                                    │  │
│  │                          │  │                                    │  │
│  └──────────────────────────┘  └────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Background:** White with subtle gray gradient
- **Layout:** 50/50 split on desktop, stacked on mobile
- **Typography:**
  - Heading: 48px, Bold (700), #000000
  - Subheading: 18px, Regular (400), #525252
  - Line height: 1.4
- **Buttons:**
  - Primary: Black bg, white text, 48px height
  - Secondary: White bg, black border, black text
  - Border radius: 6px
  - Padding: 16px 32px
- **Image:** 
  - Aspect ratio: 4:3
  - Border radius: 12px
  - Subtle shadow

---

## 3. Product Grid Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Best Sellers                                      [← →] Page 1 of 5    │
│  ────────────                                                            │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │          │  │          │  │          │  │          │               │
│  │  [IMG]   │  │  [IMG]   │  │  [IMG]   │  │  [IMG]   │               │
│  │          │  │          │  │          │  │          │               │
│  │          │  │          │  │          │  │          │               │
│  │ Product  │  │ Product  │  │ Product  │  │ Product  │               │
│  │ Name     │  │ Name     │  │ Name     │  │ Name     │               │
│  │          │  │          │  │          │  │          │               │
│  │ Category │  │ Category │  │ Category │  │ Category │               │
│  │ $49.99   │  │ $64.99   │  │ $79.99   │  │ $29.99   │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Product Card Specifications:**
- **Background:** #F5F5F5 (light gray)
- **Border:** None or 1px solid #E5E5E5
- **Border radius:** 8px
- **Padding:** 16px
- **Image:**
  - Aspect ratio: 1:1
  - Background: White
  - Border radius: 6px
- **Typography:**
  - Product name: 16px, Semibold (600), #000000
  - Category: 13px, Regular (400), #737373
  - Price: 18px, Bold (700), #000000
- **Hover state:**
  - Subtle lift (translateY: -4px)
  - Shadow increase
  - Transition: 200ms ease

**Carousel Navigation:**
- **Arrows:** 
  - Size: 40px × 40px
  - Border: 2px solid #000000
  - Background: White
  - Icon: Black, 20px
  - Position: Centered vertically
- **Pagination:** 
  - Text: "Page 1 of 5"
  - Font: 14px, Medium (500)
  - Color: #525252

---

## 4. Product Detail Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │                        │  │                                      │  │
│  │                        │  │  Noopept - Powder, 5g                │  │
│  │                        │  │  Nootropics, Cognitive               │  │
│  │    [PRODUCT IMAGE]     │  │                                      │  │
│  │                        │  │  $49.99                              │  │
│  │                        │  │                                      │  │
│  │                        │  │  ✓ Batch tested with COA             │  │
│  │                        │  │  ✓ 99%+ purity verified              │  │
│  │                        │  │  ✓ Ships within 24 hours             │  │
│  │                        │  │                                      │  │
│  │  [Thumbnail] [Thumb]   │  │  Quantity: [- 1 +]                   │  │
│  │  [Thumbnail] [Thumb]   │  │                                      │  │
│  │                        │  │  [Add to Cart]                       │  │
│  │                        │  │  [View Lab Reports]                  │  │
│  │                        │  │                                      │  │
│  └────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  Description                                                             │
│  ───────────                                                             │
│  [Product description text in clean paragraphs...]                      │
│                                                                          │
│  Specifications                                                          │
│  ──────────────                                                          │
│  • CAS Number: 157115-85-0                                              │
│  • Molecular Formula: C17H22N2O4                                        │
│  • Molecular Weight: 318.37 g/mol                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Layout:** 40/60 split (image/details)
- **Image gallery:**
  - Main image: Square, 500px
  - Thumbnails: 80px × 80px
  - Background: #F5F5F5
  - Border radius: 8px
- **Product info:**
  - Title: 32px, Bold (700), #000000
  - Category: 14px, Regular (400), #737373
  - Price: 36px, Bold (700), #000000
  - Features: 14px with checkmark icons
- **Quantity selector:**
  - Height: 48px
  - Border: 1px solid #E5E5E5
  - Buttons: 40px × 40px
- **Add to Cart button:**
  - Full width
  - Height: 56px
  - Background: #000000
  - Text: White, 16px, Semibold (600)

---

## 5. Checkout Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Octochems                                                               │
│  Cart > Information > Shipping > Payment                                │
│  ────   ───────────                                                      │
│                                                                          │
│  ┌────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │                                │  │                              │  │
│  │  Contact Information           │  │  Order Summary               │  │
│  │  ──────────────────            │  │  ─────────────               │  │
│  │                                │  │                              │  │
│  │  [Email input]                 │  │  [Product thumbnail]         │  │
│  │                                │  │  Noopept - Powder, 5g        │  │
│  │  Shipping Address              │  │  Qty: 2          $99.98      │  │
│  │  ────────────────              │  │                              │  │
│  │                                │  │  ──────────────────────────  │  │
│  │  [First name]  [Last name]     │  │                              │  │
│  │  [Company]                     │  │  Subtotal        $99.98      │  │
│  │  [Address]                     │  │  Shipping        $12.00      │  │
│  │  [Apt/Suite]                   │  │  ──────────────────────────  │  │
│  │  [City]                        │  │  Total          $111.98      │  │
│  │  [Country ▼] [State ▼] [Zip]   │  │                              │  │
│  │  [Phone]                       │  │                              │  │
│  │                                │  │                              │  │
│  │  [Continue to Shipping]        │  │                              │  │
│  │                                │  │                              │  │
│  └────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Layout:** 60/40 split (form/summary)
- **Breadcrumb:**
  - Font: 14px, Medium (500)
  - Active: #000000, underlined
  - Inactive: #A3A3A3
- **Form inputs:**
  - Height: 48px
  - Border: 1px solid #E5E5E5
  - Border radius: 6px
  - Focus: Border #000000, 2px
  - Font: 15px, Regular (400)
- **Order summary:**
  - Background: #FAFAFA
  - Border: 1px solid #E5E5E5
  - Border radius: 8px
  - Padding: 24px
- **Continue button:**
  - Full width
  - Height: 56px
  - Background: #000000
  - Text: White, 16px, Semibold (600)

---

## 6. Footer

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  [OCTOCHEMS LOGO]                                                        │
│                                                                          │
│  Research-grade chemical compounds for scientific exploration.           │
│  Licensed partners across 40+ countries ensure genuine supply chains.    │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │ Support  │  │ Company  │  │ Policies │  │ Newsletter           │   │
│  │ ────────│  │ ────────│  │ ────────│  │ ──────────           │   │
│  │          │  │          │  │          │  │                      │   │
│  │ FAQ      │  │ About Us │  │ Privacy  │  │ Get research updates │   │
│  │ Contact  │  │ Products │  │ Terms    │  │ and exclusive offers │   │
│  │ Shipping │  │ Research │  │ Refunds  │  │                      │   │
│  │ Returns  │  │ Quality  │  │ Legal    │  │ [Email] [Subscribe]  │   │
│  │          │  │          │  │          │  │                      │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘   │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  © 2025 Octochems. All rights reserved.                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Background:** #262626 (dark gray)
- **Text color:** #D4D4D4 (light gray)
- **Logo:** White version of Octochems logo
- **Column headings:**
  - Font: 14px, Semibold (600)
  - Color: #FFFFFF
  - Margin bottom: 16px
- **Links:**
  - Font: 14px, Regular (400)
  - Color: #D4D4D4
  - Hover: #FFFFFF
  - Line height: 2
- **Newsletter:**
  - Background: #171717 (darker)
  - Border radius: 8px
  - Padding: 24px
  - Input: Same as form inputs but dark theme
- **Copyright:**
  - Font: 13px, Regular (400)
  - Color: #737373
  - Border top: 1px solid #404040

---

## Design Tokens Summary

### Spacing Scale
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
4xl:  96px
```

### Border Radius
```
sm:   4px   (small elements)
md:   6px   (buttons, inputs)
lg:   8px   (cards)
xl:   12px  (images)
2xl:  16px  (large containers)
```

### Shadows
```
sm:   0 1px 2px rgba(0,0,0,0.05)
md:   0 4px 6px rgba(0,0,0,0.07)
lg:   0 10px 15px rgba(0,0,0,0.1)
xl:   0 20px 25px rgba(0,0,0,0.15)
```

### Transitions
```
fast:     150ms ease
normal:   200ms ease
slow:     300ms ease
```

---

## Responsive Breakpoints

```
Mobile:     < 640px   (1 column)
Tablet:     640-1024px (2 columns)
Desktop:    > 1024px   (4 columns)
```

### Mobile Adaptations
- Stack hero sections vertically
- Single column product grid
- Hamburger menu for navigation
- Full-width buttons
- Reduced padding and margins

---

## Key Differences from Current Design

### Removed:
- ❌ Blue color scheme
- ❌ Heavy gradients
- ❌ Complex shadows
- ❌ Rounded pill buttons
- ❌ Colorful badges

### Added:
- ✅ Monochromatic palette
- ✅ Clean product cards
- ✅ Minimal borders
- ✅ Generous whitespace
- ✅ Professional typography
- ✅ Carousel navigation
- ✅ Dark footer
- ✅ Simplified forms

### Maintained:
- ✅ Grid-based layouts
- ✅ Responsive design
- ✅ Clear hierarchy
- ✅ Accessible navigation
- ✅ E-commerce functionality

---

## Implementation Priority

1. **Phase 1:** Color system & typography
2. **Phase 2:** Header & footer components
3. **Phase 3:** Product cards & grids
4. **Phase 4:** Homepage hero
5. **Phase 5:** Product detail pages
6. **Phase 6:** Checkout flow
7. **Phase 7:** Polish & testing
