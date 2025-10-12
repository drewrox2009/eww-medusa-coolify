# PharmaDirect - Quick Start Guide

## 🚀 Your App is Running!

**Local Development**: http://localhost:3000  
**Backend API**: https://medusa.eww-pew.com

---

## ✅ Environment Configured

Your [`.env.local`](.env.local) is already set up to connect to your Coolify Medusa backend:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

---

## 📦 Import Products (Do This First!)

1. **Navigate to your Medusa admin panel**:  
   https://medusa.eww-pew.com/app

2. **Go to Products → Import**

3. **Upload the file**:  
   [`pharmaceutical-products-seed.csv`](../pharmaceutical-products-seed.csv)

4. **Wait for import to complete**  
   You should see 13 products with 44 variants imported

---

## 🎨 What's Built & Working

### Pages You Can Access Now:

1. **Homepage**: http://localhost:3000

   - Hero section with value proposition
   - Trust indicators
   - Category browse
   - Call-to-action sections

2. **Product Catalog**: http://localhost:3000/products

   - Product grid (will show products after import)
   - Category filters (11 categories)
   - Search functionality
   - Sort and filter options

3. **Product Detail**: http://localhost:3000/products/[product-handle]

   - Full product information
   - Dosage & quantity selector
   - Add to cart functionality
   - Trust badges

4. **Shopping Cart**: http://localhost:3000/cart
   - Cart items list
   - Quantity adjustment
   - Order summary
   - Checkout button (to be built)

### Features Working:

✅ Browse products  
✅ Search medications  
✅ Filter by category  
✅ View product details  
✅ Select dosage/quantity  
✅ Add to cart  
✅ Cart persistence  
✅ Responsive design

---

## 🔧 Update Medusa CORS (Important!)

For the frontend to communicate with your Medusa backend, update these environment variables in your **medusa-server** on Coolify:

```env
# Add your frontend URL (once deployed)
STORE_CORS=https://your-frontend-domain.com,http://localhost:3000

# For admin access (if needed)
ADMIN_CORS=https://your-frontend-domain.com,http://localhost:3000

# Update AUTH_CORS
AUTH_CORS=https://your-frontend-domain.com,http://localhost:3000
```

**For local development**, add `http://localhost:3000` to STORE_CORS in your Medusa backend.

---

## 🌐 Deploy to Coolify

### Step 1: Create New Service

1. Go to Coolify dashboard
2. Create new "Application"
3. Select this Git repository
4. Choose "Next.js" build pack

### Step 2: Configure Build

**Build Command**:

```bash
npm install && npm run build
```

**Start Command**:

```bash
npm run start
```

**Port**: `3000`

### Step 3: Set Environment Variables

Add these in Coolify:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

**Important**: Mark these as "Build Variables" ✅

### Step 4: Set Domain & Deploy

1. Configure your domain (e.g., `pharma.yourdomain.com`)
2. Enable SSL
3. Click "Deploy"

### Step 5: Update Medusa CORS

Once deployed, update medusa-server CORS to include your new frontend domain.

---

## 📝 Complete Deployment Guide

See [`COOLIFY_DEPLOYMENT.md`](COOLIFY_DEPLOYMENT.md) for:

- Detailed deployment steps
- Docker configuration
- Troubleshooting guide
- Environment variable reference
- CORS setup instructions

---

## 🎯 Next Features to Build

### Authentication (Recommended Next)

- Login page
- Registration page
- User account dashboard
- Order history

### Checkout Flow

- Shipping information form
- Payment method selection
- Order confirmation
- Payment provider integration (BTCPay, Solana, Shkeeper)

### Polish

- Mobile navigation menu
- Loading states
- Error handling
- SEO optimization

---

## 🐛 Troubleshooting

### Products Not Showing?

**Solution**: Import the CSV file in Medusa admin first

### CORS Errors?

**Solution**: Add frontend URL to STORE_CORS in Medusa backend

### Images Not Loading?

**Solution**: Already configured in `next.config.js` for Unsplash

### Build Failing?

**Solution**: Check all environment variables are set

---

## 📞 Quick Commands

```bash
# Start development (already running)
npm run dev

# Build for production
npm run build

# Start production
npm run start

# Check for errors
npm run lint
```

---

## ✨ You're All Set!

The pharmaceutical e-commerce platform is ready to use:

1. ✅ **Import products** via Medusa admin
2. ✅ **Test locally** at http://localhost:3000
3. ✅ **Deploy to Coolify** following the guide
4. ✅ **Build remaining features** (auth, checkout, payments)

**The foundation is solid and professional. Happy building!** 🚀💊
