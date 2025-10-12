import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the lowest price variant
  const lowestPrice = product.variants?.reduce((min, variant) => {
    const price = variant.prices?.[0]?.amount || 0;
    return price < min ? price : min;
  }, Infinity);

  // Get variant count
  const variantCount = product.variants?.length || 0;

  return (
    <Link href={`/products/${product.handle}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-200 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {product.title}
            </h3>

            {product.subtitle && (
              <p className="text-sm text-gray-600 mb-2">{product.subtitle}</p>
            )}

            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing and CTA */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Starting at</p>
                <p className="text-lg font-bold text-gray-900">
                  {lowestPrice && lowestPrice !== Infinity
                    ? formatPrice(lowestPrice)
                    : "Price unavailable"}
                </p>
              </div>

              {variantCount > 1 && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {variantCount} options
                </span>
              )}
            </div>

            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
