import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getProducts } from "@/lib/medusa/products";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/home/HeroCarousel";

export default async function Home() {
  // Fetch products for featured and new arrivals sections
  const productsResponse = await getProducts({ limit: 12 });
  const allProducts = productsResponse.products ?? [];
  
  // Featured: First 3 products
  const featuredProducts = allProducts.slice(0, 3);
  
  // New Arrivals: Next 3 products (or last 3 if we have more than 6)
  const newArrivals = allProducts.length > 6 
    ? allProducts.slice(allProducts.length - 3) 
    : allProducts.slice(3, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel - Full Width */}
      <HeroCarousel />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Featured Compounds
              </h2>
              <p className="mt-2 text-gray-600">
                Top picks from our research catalog
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-black hover:text-gray-700"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No featured products available at this time.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-black hover:text-gray-700"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                New Arrivals
              </h2>
              <p className="mt-2 text-gray-600">
                Recently added to our catalog
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-black hover:text-gray-700"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Check back soon for new additions to our catalog.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-black hover:text-gray-700"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Why Researchers Choose Us
            </h2>
          </div>

          <div className="grid max-w-xl mx-auto grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Lab-Tested Quality
              </h3>
              <p className="text-gray-600">
                Third-party verified with certificates of analysis for every batch
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Discreet Delivery
              </h3>
              <p className="text-gray-600">
                Plain packaging with tracking to 80+ countries worldwide
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Research Resources
              </h3>
              <p className="text-gray-600">
                Access to documentation and expert guidance for your work
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join researchers worldwide who trust our quality and service
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/products"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 transition-colors"
              >
                Browse Catalog
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
