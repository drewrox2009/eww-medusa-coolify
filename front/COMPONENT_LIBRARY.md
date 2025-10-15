# Octochems Component Library

This document details all reusable UI components for the Octochems storefront redesign.

---

## Buttons

### Primary Button
```
┌─────────────────────┐
│   Add to Cart       │  ← Black (#000000) background
└─────────────────────┘     White text, 16px Semibold
                            Height: 48px, Padding: 16px 32px
                            Border radius: 6px
                            Hover: #262626
```

### Secondary Button
```
┌─────────────────────┐
│   Learn More        │  ← White background
└─────────────────────┘     Black border (1px)
                            Black text, 16px Semibold
                            Height: 48px, Padding: 16px 32px
                            Border radius: 6px
                            Hover: #FAFAFA background
```

### Icon Button
```
┌────┐
│ 🛒 │  ← 40px × 40px
└────┘     Border: 1px solid #E5E5E5
           Background: White
           Icon: 20px, #525252
           Hover: Icon #000000
           Border radius: 8px
```

### Text Button
```
View all products →  ← No background/border
                       14px Medium
                       Color: #000000
                       Hover: underline
```

---

## Form Elements

### Text Input
```
┌─────────────────────────────────────┐
│ Email address                       │  ← Height: 48px
└─────────────────────────────────────┘     Border: 1px solid #E5E5E5
                                            Border radius: 6px
                                            Padding: 12px 16px
                                            Font: 15px Regular
                                            Focus: Border #000000 (2px)
                                            Placeholder: #A3A3A3
```

### Select Dropdown
```
┌─────────────────────────────────────┐
│ United States                    ▼ │  ← Same as text input
└─────────────────────────────────────┘     Arrow icon on right
                                            Padding right: 40px
```

### Quantity Selector
```
┌───┬─────┬───┐
│ - │  1  │ + │  ← Height: 48px
└───┴─────┴───┘     Border: 1px solid #E5E5E5
                    Border radius: 6px
                    Buttons: 40px × 40px
                    Number: 16px Medium, centered
```

### Checkbox
```
☑ Save this information  ← 20px × 20px
                           Border: 2px solid #E5E5E5
                           Checked: Black background
                           White checkmark
                           Label: 14px Regular, #525252
```

### Search Input
```
┌─────────────────────────────────────┐
│ 🔍 Search products...               │  ← Height: 44px
└─────────────────────────────────────┘     Icon: 18px, left side
                                            Border: 1px solid #E5E5E5
                                            Border radius: 22px (pill)
                                            Background: #FAFAFA
```

---

## Cards

### Product Card
```
┌─────────────────────────┐
│                         │
│      [PRODUCT IMAGE]    │  ← Aspect ratio: 1:1
│                         │     Background: White
│                         │     Border radius: 6px
│─────────────────────────│
│                         │
│ Noopept - Powder, 5g    │  ← 16px Semibold, #000000
│                         │
│ Nootropics, Cognitive   │  ← 13px Regular, #737373
│                         │
│ $49.99                  │  ← 18px Bold, #000000
│                         │
└─────────────────────────┘

Card specs:
- Background: #F5F5F5
- Border: None or 1px solid #E5E5E5
- Border radius: 8px
- Padding: 16px
- Hover: translateY(-4px), shadow increase
```

### Category Card
```
┌─────────────────────────────────────┐
│                                     │
│  Nootropics                         │  ← 20px Semibold
│                                     │
│  Cognitive enhancement and          │  ← 14px Regular
│  mental performance compounds       │     #525252
│                                     │
│  View products →                    │  ← 14px Medium
│                                     │     #000000
└─────────────────────────────────────┘

Card specs:
- Background: White
- Border: 1px solid #E5E5E5
- Border radius: 12px
- Padding: 32px
- Hover: Border #000000
```

### Info Card (Trust Indicators)
```
┌─────────────────────────┐
│                         │
│  ✓                      │  ← Icon: 24px, #000000
│                         │     Background: #F5F5F5
│  Lab Tested             │     Circle: 48px
│                         │
│  Every batch verified   │  ← Title: 16px Semibold
│  with third-party COA   │     Text: 14px Regular
│                         │     Color: #525252
└─────────────────────────┘

Card specs:
- Background: White
- Border: 1px solid #E5E5E5
- Border radius: 8px
- Padding: 24px
```

---

## Navigation

### Main Navigation Item
```
Products  ← 14px Medium (#525252)
          Hover: #000000
          Active: #000000 + underline (2px)
          Spacing: 32px between items
```

### Breadcrumb
```
Home > Products > Nootropics  ← 14px Regular
                                 Separator: >
                                 Current: #000000, Bold
                                 Previous: #737373
                                 Hover: underline
```

### Pagination
```
[←]  Page 1 of 5  [→]  ← Arrows: 40px × 40px
                         Border: 2px solid #000000
                         Background: White
                         Text: 14px Medium, #525252
```

### Mobile Menu Toggle
```
┌────┐
│ ☰  │  ← 44px × 44px
└────┘     Border: 1px solid #E5E5E5
           Background: White
           Icon: 24px, #525252
           Border radius: 8px
```

---

## Badges & Labels

### Category Badge
```
┌──────────────┐
│ Nootropics   │  ← Background: #F5F5F5
└──────────────┘     Text: 12px Semibold, #000000
                     Padding: 4px 12px
                     Border radius: 4px
```

### Sale Badge
```
┌──────┐
│ SALE │  ← Background: #000000
└──────┘     Text: 11px Bold, White
             Padding: 4px 8px
             Border radius: 3px
             Position: Absolute, top-right
```

### Stock Status
```
● In Stock  ← Green dot (#10B981)
             12px Medium
             Color: #525252
```

### Cart Badge
```
  🛒
  ②   ← Circle: 20px diameter
       Background: #000000
       Text: 11px Bold, White
       Position: Top-right of cart icon
```

---

## Typography Examples

### Headings
```
H1: Research-Grade Compounds        ← 48px Bold (#000000)
H2: Featured Products               ← 36px Bold (#000000)
H3: Product Categories              ← 28px Semibold (#000000)
H4: Customer Reviews                ← 20px Semibold (#000000)
H5: Specifications                  ← 16px Semibold (#000000)
```

### Body Text
```
Large:  Premium nootropics...       ← 18px Regular (#525252)
Base:   Product description...      ← 16px Regular (#525252)
Small:  Additional details...       ← 14px Regular (#737373)
Tiny:   © 2025 Octochems           ← 13px Regular (#A3A3A3)
```

### Special Text
```
Price:     $49.99                   ← 24px Bold (#000000)
Link:      Learn more →             ← 14px Medium (#000000)
Caption:   Ships in 24 hours        ← 13px Regular (#737373)
Label:     Email address            ← 13px Medium (#525252)
```

---

## Icons

### Icon Sizes
```
Small:   16px  (inline with text)
Medium:  20px  (buttons, navigation)
Large:   24px  (feature highlights)
XLarge:  32px  (empty states)
```

### Icon Style
- Line icons (not filled)
- Stroke width: 2px
- Color: Inherit from parent
- Lucide React icon set

### Common Icons
```
🔍  Search
🛒  Shopping cart
👤  User account
❤️  Wishlist
✓   Checkmark
✕   Close
←   Back/Previous
→   Forward/Next
☰   Menu
⚙   Settings
📦  Package/Shipping
🔒  Secure/Lock
```

---

## Spacing System

### Component Spacing
```
Tight:    8px   (between related items)
Normal:   16px  (default spacing)
Relaxed:  24px  (between sections)
Loose:    32px  (major sections)
```

### Container Padding
```
Mobile:   16px  (left/right)
Tablet:   24px  (left/right)
Desktop:  32px  (left/right)
```

### Section Padding
```
Mobile:   48px  (top/bottom)
Desktop:  80px  (top/bottom)
```

---

## Shadows

### Elevation Levels
```
Level 1 (Subtle):
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  Use: Input focus, subtle hover

Level 2 (Card):
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  Use: Product cards, dropdowns

Level 3 (Elevated):
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  Use: Modals, popovers

Level 4 (Floating):
  box-shadow: 0 20px 25px rgba(0,0,0,0.15);
  Use: Sticky header on scroll
```

---

## Animations

### Hover Transitions
```css
/* Button hover */
transition: background-color 200ms ease,
            transform 200ms ease;

/* Card hover */
transition: transform 200ms ease,
            box-shadow 200ms ease;
transform: translateY(-4px);

/* Link hover */
transition: color 150ms ease;
```

### Loading States
```
Skeleton:
  Background: linear-gradient(
    90deg,
    #F5F5F5 0%,
    #E5E5E5 50%,
    #F5F5F5 100%
  );
  Animation: shimmer 1.5s infinite;
```

### Page Transitions
```
Fade in:
  opacity: 0 → 1
  duration: 300ms ease

Slide up:
  transform: translateY(20px) → translateY(0)
  opacity: 0 → 1
  duration: 400ms ease
```

---

## Responsive Behavior

### Breakpoints
```
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px
```

### Grid Columns
```
Mobile:     1 column
Tablet:     2 columns
Desktop:    4 columns
```

### Component Adaptations

**Header:**
- Mobile: Logo + hamburger menu
- Desktop: Logo + full navigation + icons

**Product Grid:**
- Mobile: 1 column, full width
- Tablet: 2 columns, 16px gap
- Desktop: 4 columns, 24px gap

**Hero Section:**
- Mobile: Stacked (image on top)
- Desktop: Side-by-side (50/50)

**Footer:**
- Mobile: Stacked columns
- Tablet: 2 columns
- Desktop: 4 columns

---

## Accessibility

### Focus States
```
All interactive elements:
  outline: 2px solid #000000;
  outline-offset: 2px;
```

### Color Contrast
```
All text meets WCAG AA standards:
- Black on white: 21:1
- #525252 on white: 7.5:1
- #737373 on white: 4.7:1
```

### Touch Targets
```
Minimum size: 44px × 44px
Spacing: 8px minimum between targets
```

### Screen Reader Text
```
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
```

---

## Implementation Notes

### CSS Variables
```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-800: #262626;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### Tailwind Classes
```
Primary button:
  bg-black text-white px-8 py-3 rounded-md
  font-semibold hover:bg-gray-800 transition

Product card:
  bg-gray-100 rounded-lg p-4 border border-gray-200
  hover:-translate-y-1 hover:shadow-lg transition

Section:
  py-16 lg:py-20
```

---

## Component Checklist

- [x] Buttons (Primary, Secondary, Icon, Text)
- [x] Form inputs (Text, Select, Checkbox, Search)
- [x] Cards (Product, Category, Info)
- [x] Navigation (Main, Breadcrumb, Pagination)
- [x] Badges & Labels
- [x] Typography system
- [x] Icon library
- [x] Spacing system
- [x] Shadow system
- [x] Animation patterns
- [x] Responsive behavior
- [x] Accessibility features
