import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400 text-sm">Product Image</span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-black line-clamp-2">
          {product.title}
        </h3>

        {product.subtitle && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.subtitle}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black">
              ${product.variants?.[0]?.prices?.[0]?.amount ? (product.variants[0].prices[0].amount / 100).toFixed(2) : 'N/A'}
            </span>
          </div>

          <Link
            href={`/products/${product.handle}`}
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
