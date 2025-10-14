import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { name: "Erectile Dysfunction", slug: "erectile-dysfunction", count: 13 },
    { name: "Hair Loss", slug: "hair-loss", count: 3 },
    { name: "Blood Pressure", slug: "blood-pressure", count: 4 },
    { name: "Cholesterol", slug: "cholesterol", count: 4 },
    { name: "Antidepressants", slug: "antidepressants", count: 4 },
    { name: "Diabetes", slug: "diabetes", count: 4 },
    { name: "Antibiotics", slug: "antibiotics", count: 4 },
    { name: "Pain Management", slug: "pain-management", count: 2 },
    { name: "Asthma", slug: "asthma", count: 2 },
    { name: "Thyroid", slug: "thyroid", count: 2 },
    { name: "Acid Reflux", slug: "acid-reflux", count: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Categories
            </h1>
            <p className="text-lg text-gray-600">
              Browse our comprehensive range of pharmaceutical products by
              category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.count} products
                    </p>
                  </div>
                  <div className="text-primary-600">
                    <svg
                      className="h-6 w-6"
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

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
