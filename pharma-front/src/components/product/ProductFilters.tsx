"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "Erectile Dysfunction",
  "Hair Loss",
  "Blood Pressure",
  "Cholesterol",
  "Antidepressants",
  "Diabetes",
  "Antibiotics",
  "Pain Management",
  "Asthma",
  "Thyroid",
  "Acid Reflux",
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);

    // Update URL with selected categories
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set("categories", updated.join(","));
    } else {
      params.delete("categories");
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    router.push("/products");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range - Placeholder for future implementation */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <p className="text-xs text-gray-500">Coming soon</p>
      </div>

      {/* Prescription Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Prescription</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
              Prescription Required
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
              Over the Counter
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
