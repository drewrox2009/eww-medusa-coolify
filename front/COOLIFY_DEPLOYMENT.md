# Coolify Deployment Guide - PharmaDirect Frontend

## Environment Variables for Coolify

When deploying the pharma-front application to Coolify, you need to configure these environment variables:

### Required Environment Variables

```env
# Medusa Backend URL (replace with your actual backend URL)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com

# Medusa Publishable API Key (optional, get from Medusa admin)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=

# Store Configuration
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

### Example with Your Setup

Based on your existing Medusa deployment, your environment variables should look like:

```env
# Point to your Medusa server URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com

# Optional - get from Medusa admin panel
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=

# Store settings
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

---

## Coolify Deployment Steps

### 1. Create New Service in Coolify

1. Go to your Coolify dashboard
2. Click "Add New Resource" → "Application"
3. Select your Git repository or upload the code
4. Choose "Next.js" as the application type

### 2. Configure Build Settings

**Build Pack**: `nixpacks`

**Build Command**:

```bash
npm install && npm run build
```

**Start Command**:

```bash
npm run start
```

**Port**: `3000`

### 3. Set Environment Variables

In Coolify's environment variables section, add:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com
NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

**Important**: Make sure `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points to your actual Medusa backend URL.

### 4. Configure Domain

1. Set your custom domain (e.g., `pharma.yourdomain.com`)
2. Enable SSL/HTTPS
3. Wait for DNS propagation

### 5. Deploy

1. Click "Deploy" button
2. Monitor build logs
3. Once deployed, verify the application is accessible

---

## CORS Configuration in Medusa

For the frontend to communicate with your Medusa backend, update your Medusa environment variables:

### In your medusa-server on Coolify:

```env
# Add your frontend URL to STORE_CORS
STORE_CORS=https://pharma.yourdomain.com

# If you need admin access from frontend
ADMIN_CORS=https://pharma.yourdomain.com

# Update AUTH_CORS
AUTH_CORS=https://pharma.yourdomain.com
```

**Important**: Replace `pharma.yourdomain.com` with your actual frontend domain.

---

## Docker Deployment (Alternative)

If you prefer Docker deployment, use this Dockerfile:

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com
ENV NEXT_PUBLIC_STORE_NAME=PharmaDirect
ENV NEXT_PUBLIC_STORE_CURRENCY=USD

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### next.config.js Update

Add to your `next.config.js` for standalone build:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## Local Development Setup

### 1. Clone or navigate to the project

```bash
cd pharma-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For local development with local Medusa
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# For local development with remote Medusa
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.eww-pew.com

NEXT_PUBLIC_STORE_NAME=PharmaDirect
NEXT_PUBLIC_STORE_CURRENCY=USD
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Troubleshooting

### Issue: CORS Errors

**Problem**: Frontend can't connect to Medusa backend

**Solution**: Update Medusa's CORS settings:

```env
STORE_CORS=https://your-frontend-domain.com,http://localhost:3000
```

### Issue: Images Not Loading

**Problem**: Product images from Unsplash not displaying

**Solution**: Add image domains to `next.config.js`:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
}
```

### Issue: Build Fails

**Problem**: Build command fails in Coolify

**Solution**: Ensure environment variables are set BEFORE build:

1. In Coolify, mark `NEXT_PUBLIC_*` variables as "Build Variables"
2. Rebuild the application

### Issue: API Connection Timeout

**Problem**: Medusa backend not responding

**Solution**:

1. Verify Medusa backend is running
2. Check backend URL is correct
3. Verify CORS is properly configured
4. Check network/firewall rules

---

## Production Checklist

Before going live:

- [ ] Environment variables configured in Coolify
- [ ] CORS updated in Medusa backend
- [ ] Custom domain configured with SSL
- [ ] Product data imported to Medusa
- [ ] Test complete shopping flow
- [ ] Payment providers configured
- [ ] Mobile responsiveness verified
- [ ] Error pages tested
- [ ] Performance optimization applied

---

## Monitoring & Logs

### View Logs in Coolify

1. Go to your pharma-front service
2. Click "Logs" tab
3. Monitor for errors or warnings

### Common Log Messages

**Successful Start**:

```
✓ Ready in XXXms
✓ Compiled / in XXXms
○ Compiling /products...
```

**CORS Issue**:

```
Access to fetch at 'https://medusa.eww-pew.com/store/products'
from origin 'https://pharma.yourdomain.com' has been blocked by CORS
```

Fix: Update STORE_CORS in Medusa

---

## Quick Reference

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| **Node Version**  | 20+                            |
| **Port**          | 3000                           |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start`                |
| **Backend URL**   | `https://medusa.eww-pew.com`   |

---

## Need Help?

Common deployment issues and solutions:

1. **App won't start**: Check environment variables are set
2. **Can't connect to Medusa**: Verify CORS configuration
3. **Build fails**: Ensure all dependencies are in package.json
4. **Slow performance**: Enable image optimization in next.config.js

For Medusa-specific issues, check:

- Medusa backend health: `https://medusa.eww-pew.com/health`
- Medusa admin panel: `https://medusa.eww-pew.com/app`
