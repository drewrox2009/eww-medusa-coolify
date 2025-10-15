import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/octochems-logo.svg"
                  alt="Octochems"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-black">Octochems</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/cart" className="p-2 text-gray-600 hover:text-black transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                </svg>
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
              Research-Grade Chemical Compounds
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Premium nootropics and research chemicals for scientific exploration.
              Quality-verified compounds with transparent sourcing and discreet shipping worldwide.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/products"
                className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Browse Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-black"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Featured Compounds
            </h2>
            <p className="mt-4 text-gray-600">
              Our most popular research-grade compounds, verified for purity and quality.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Product Card 1 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Noopept</h3>
              <p className="text-sm text-gray-600 mb-4">Cognitive enhancement compound</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-black">$49.99</span>
                <Link
                  href="/products/noopept"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Aniracetam</h3>
              <p className="text-sm text-gray-600 mb-4">Memory and learning enhancement</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-black">$39.99</span>
                <Link
                  href="/products/aniracetam"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Piracetam</h3>
              <p className="text-sm text-gray-600 mb-4">Original nootropic compound</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-black">$29.99</span>
                <Link
                  href="/products/piracetam"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-50"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Why Choose Octochems
            </h2>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-black">
                  <CheckCircle2 className="h-5 w-5 flex-none text-black" />
                  Quality Verified
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Every batch is third-party tested with certificates of analysis available for all compounds.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-black">
                  <CheckCircle2 className="h-5 w-5 flex-none text-black" />
                  Discreet Shipping
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Plain packaging with no branding. Trackable shipping to 80+ countries worldwide.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-black">
                  <CheckCircle2 className="h-5 w-5 flex-none text-black" />
                  Research Support
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Access to research papers and expert guidance for your scientific exploration.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Your Research Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of researchers worldwide who trust Octochems for their research-grade compounds.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create Account
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-gray-300 hover:text-white"
              >
                Contact Support <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/octochems-logo.svg"
                  alt="Octochems"
                  width={32}
                  height={32}
                  className="h-8 w-8 brightness-0 invert"
                />
                <span className="text-xl font-bold text-white">Octochems</span>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Research-grade chemical compounds for scientific exploration.
                Quality-verified with transparent sourcing and discreet worldwide shipping.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-sm text-gray-400 hover:text-white">All Compounds</Link></li>
                <li><Link href="/categories" className="text-sm text-gray-400 hover:text-white">Categories</Link></li>
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-white">Quality Standards</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/shipping" className="text-sm text-gray-400 hover:text-white">Shipping</Link></li>
                <li><Link href="/returns" className="text-sm text-gray-400 hover:text-white">Returns</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center">
              © 2025 Octochems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
