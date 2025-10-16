import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="product-card h-full flex flex-col">
        <div className="aspect-square w-full bg-gray-50 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-300 text-center p-4">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-black line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.title}
          </h3>

          {product.subtitle && (
            <p className="text-sm text-gray-500 line-clamp-2 flex-1">
              {product.subtitle}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 mt-auto">
            <span className="text-lg font-bold text-black">
              {product.variants?.[0]?.calculated_price?.calculated_amount
                ? formatPrice(product.variants[0].calculated_price.calculated_amount)
                : 'Price N/A'}
            </span>
            <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
