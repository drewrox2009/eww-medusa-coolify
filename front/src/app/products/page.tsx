import Link from "next/link";
import { getProducts } from "@/lib/medusa/products";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import SearchBar from "@/components/common/SearchBar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts({
    q: params.q,
    limit: 50,
  });

  const items = products.products ?? [];
  const resultCount = items.length;

  return (
    <div className="bg-gray-50">
      <section className="section-padding pt-0">
        <div className="container-custom space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="badge">
                Explore compounds
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-black sm:text-4xl">
                  Shop research compounds by category
                </h1>
                <p className="max-w-xl text-base text-gray-600">
                  Discover clinically vetted generics with transparent pricing,
                  pharmacist guidance, and global shipping.
                </p>
              </div>
            </div>

            <div className="w-full max-w-md">
              <SearchBar initialQuery={params.q} />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="card-surface h-full p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Filter results
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Refine by therapeutic class, dosage form, and other
                    criteria.
                  </p>
                </div>
                <ProductFilters />
              </div>
            </aside>

            <main className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-gray-600">
                  {resultCount === 0
                    ? "No compounds found"
                    : `Showing ${resultCount} ${
                        resultCount === 1 ? "compound" : "compounds"
                      }`}
                </p>
                {params.q && (
                  <Link
                    href="/products"
                    className="inline-flex items-center text-sm font-medium text-black hover:text-gray-800"
                  >
                    Reset search
                  </Link>
                )}
              </div>

              {resultCount > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="card-surface flex flex-col items-center gap-4 px-10 py-12 text-center">
                  <p className="text-base font-semibold text-black">
                    Adjust your filters to find additional compounds.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try searching by condition name or remove filters to browse
                    the full catalog.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-500"
                  >
                    View all compounds
                  </Link>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
