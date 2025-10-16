import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { name: "Nootropics", slug: "nootropics", count: 15, description: "Cognitive enhancement compounds" },
    { name: "Research Chemicals", slug: "research-chemicals", count: 8, description: "Novel compounds for study" },
    { name: "Amino Acids", slug: "amino-acids", count: 6, description: "Essential building blocks" },
    { name: "Adaptogens", slug: "adaptogens", count: 4, description: "Stress response modulators" },
    { name: "Peptides", slug: "peptides", count: 3, description: "Bioactive protein fragments" },
    { name: "Vitamins & Minerals", slug: "vitamins-minerals", count: 5, description: "Essential micronutrients" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Research Compound Categories
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Explore our curated selection of research-grade chemical compounds,
            organized by therapeutic class and application.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <p className="text-sm font-medium text-black">
                    {category.count} compounds
                  </p>
                </div>
                <div className="text-black ml-4">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Browse All Compounds
          </Link>
        </div>
      </div>
    </div>
  );
}
