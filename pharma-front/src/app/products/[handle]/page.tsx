import { getProduct } from "@/lib/medusa/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";
import AddToCartButton from "@/components/product/AddToCartButton";
import VariantSelector from "@/components/product/VariantSelector";

export default async function ProductDetailPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                PharmaDirect
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Cart (0)
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="relative h-96">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>

            {product.subtitle && (
              <p className="text-xl text-gray-600 mb-4">{product.subtitle}</p>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Starting at</p>
              <p className="text-3xl font-bold text-gray-900">
                {product.variants?.[0]?.calculated_price?.calculated_amount
                  ? formatPrice(
                      product.variants[0].calculated_price.calculated_amount
                    )
                  : "Price unavailable"}
              </p>
            </div>

            {/* Variant Selector */}
            <div className="mb-6">
              <VariantSelector product={product} />
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Trust Badges */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-green-900 text-sm">
                    Quality Assured
                  </p>
                  <p className="text-xs text-green-700">
                    All medications sourced from verified manufacturers
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">
                    Secure Checkout
                  </p>
                  <p className="text-xs text-blue-700">
                    Cryptocurrency payments for enhanced privacy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Tabs */}
        <div className="border-t border-gray-200 pt-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Information
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Shipping Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• International shipping available</li>
                <li>• Estimated delivery: 10-14 business days</li>
                <li>• Tracking provided for all orders</li>
                <li>• Discreet packaging</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment Options
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Bitcoin (BTC)</li>
                <li>• Lightning Network</li>
                <li>• Solana (SOL)</li>
                <li>• Other cryptocurrencies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="container-custom">
          <div className="text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} PharmaDirect. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
