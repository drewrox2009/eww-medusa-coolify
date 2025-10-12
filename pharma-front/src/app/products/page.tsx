import { getProducts } from "@/lib/medusa/products";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import SearchBar from "@/components/common/SearchBar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const products = await getProducts({
    q: searchParams.q,
    limit: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with same navigation as homepage */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-primary-600">
                PharmaDirect
              </a>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="/products" className="text-primary-600 font-semibold">
                Products
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <a
                href="/cart"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Cart (0)
              </a>
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Browse our selection of affordable generic medications
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar initialQuery={searchParams.q} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {products.products && products.products.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {products.products.length}{" "}
                  {products.products.length === 1 ? "product" : "products"}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found</p>
                <a
                  href="/products"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </a>
              </div>
            )}
          </main>
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
