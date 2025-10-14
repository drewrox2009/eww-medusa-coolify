"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils/format";

interface VariantSelectorProps {
  product: any;
}

export default function VariantSelector({ product }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.id || null
  );

  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  const selected = product.variants.find((v: any) => v.id === selectedVariant);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-3">
        Select Dosage & Quantity
      </label>

      <div className="grid grid-cols-1 gap-3">
        {product.variants.map((variant: any) => {
          const price =
            variant.calculated_price?.calculated_amount ||
            variant.prices?.[0]?.amount ||
            0;
          const isSelected = variant.id === selectedVariant;

          return (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
              className={`
                relative flex items-center justify-between p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-primary-600 bg-primary-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }
              `}
            >
              <div className="flex-1 text-left">
                <p
                  className={`font-semibold ${
                    isSelected ? "text-primary-900" : "text-slate-900"
                  }`}
                >
                  {variant.title}
                </p>
                {variant.sku && (
                  <p className="text-xs text-slate-500 mt-1">
                    SKU: {variant.sku}
                  </p>
                )}
              </div>

              <div className="text-right ml-4">
                <p
                  className={`text-lg font-bold ${
                    isSelected ? "text-primary-700" : "text-slate-900"
                  }`}
                >
                  {formatPrice(price)}
                </p>
                {variant.inventory_quantity !== undefined && (
                  <p className="text-xs text-slate-500 mt-1">
                    {variant.inventory_quantity > 0
                      ? `${variant.inventory_quantity} in stock`
                      : "Out of stock"}
                  </p>
                )}
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Variant Info */}
      {selected && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Selected:</span> {selected.title}
          </p>
        </div>
      )}
    </div>
  );
}
