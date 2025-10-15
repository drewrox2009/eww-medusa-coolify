# Oceanica Pharma - Frontend

A modern, trustworthy pharmaceutical e-commerce platform built with Next.js 14 and Medusa backend.

## Getting Started

### Prerequisites

- **Node.js 20+** (Required for Medusa SDK compatibility)
- npm or yarn package manager
- Medusa backend running (see medusa/ directory)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.production .env.local
# Edit .env.local with your configuration
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Key Environment Variables

```env
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-key

# Payment Providers (configure as needed)
BTCPAY_SERVER_URL=https://your-btcpay-server.com
SOLANA_MERCHANT_WALLET=your-solana-address
SHKEEPER_API_KEY=your-shkeeper-key
NOWPAYMENTS_API_KEY=your-nowpayments-key
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/` - Utilities and API integrations
- `docs/` - Documentation and guides

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
