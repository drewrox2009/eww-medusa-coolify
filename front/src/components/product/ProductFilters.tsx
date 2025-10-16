"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const CATEGORY_OPTIONS = [
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

type FilterSection = {
  title: string;
  items: { label: string; value: string }[];
};

const availabilityOptions: FilterSection = {
  title: "Availability status",
  items: [
    { label: "Restricted access", value: "restricted" },
    { label: "General availability", value: "general" },
  ],
};

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([]);

  useEffect(() => {
    const urlCategories = searchParams.get("categories");
    if (urlCategories) {
      setSelectedCategories(urlCategories.split(","));
    }
    const urlAvailability = searchParams.get("availability");
    if (urlAvailability) {
      setAvailabilityFilters(urlAvailability.split(","));
    }
  }, [searchParams]);

  const activeFilterCount =
    selectedCategories.length + availabilityFilters.length;

  const updateQueryParams = (categories: string[], availability: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    } else {
      params.delete("categories");
    }

    if (availability.length > 0) {
      params.set("availability", availability.join(","));
    } else {
      params.delete("availability");
    }

    router.push(`/products?${params.toString()}`);
  };

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    updateQueryParams(updated, availabilityFilters);
  };

  const toggleAvailability = (value: string) => {
    const updated = availabilityFilters.includes(value)
      ? availabilityFilters.filter((item) => item !== value)
      : [...availabilityFilters, value];

    setAvailabilityFilters(updated);
    updateQueryParams(selectedCategories, updated);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setAvailabilityFilters([]);
    router.push("/products");
  };

  const sortedCategories = useMemo(() => {
    return CATEGORY_OPTIONS.sort((a, b) => a.localeCompare(b));
  }, []);

  return (
    <aside className="card-surface sticky top-28 space-y-6 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-primary-100/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
            <Filter className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Filters</p>
            <p className="text-xs text-slate-500">
              {activeFilterCount > 0
                ? `${activeFilterCount} active ${
                    activeFilterCount === 1 ? "filter" : "filters"
                  }`
                : "Refine to match your care plan"}
            </p>
          </div>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition hover:text-primary-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-8 px-6 pb-6">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Therapeutic categories
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {sortedCategories.map((category) => {
              const isActive = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-primary-400 bg-primary-100/60 text-primary-700 shadow-subtle"
                      : "border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600"
                  )}
                >
                  <span>{category}</span>
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
                      isActive
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    )}
                  >
                    {isActive ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {availabilityOptions.title}
          </h3>
          <div className="space-y-2">
            {availabilityOptions.items.map((option) => {
              const isActive = availabilityFilters.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleAvailability(option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="flex-1 text-left">{option.label}</span>
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                      isActive
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    )}
                  >
                    {isActive ? "✓" : ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-primary-100 bg-primary-50/60 px-4 py-5 text-xs text-primary-700">
          Save favorite filters by creating an account for faster reordering and
          personalized recommendations.
        </div>
      </div>
    </aside>
  );
}
