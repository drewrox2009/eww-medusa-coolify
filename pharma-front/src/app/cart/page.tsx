"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getCart } from "@/lib/medusa/cart";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const { cartId, itemCount } = useCartStore();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      if (cartId) {
        try {
          const cartData = await getCart(cartId);
          setCart(cartData.cart);
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      }
      setIsLoading(false);
    }

    loadCart();
  }, [cartId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                PharmaDirect
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-primary-600 font-semibold">
                Cart ({itemCount})
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding medications to your cart
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.variant?.product?.thumbnail ? (
                        <Image
                          src={item.variant.product.thumbnail}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${
                          item.variant?.product?.handle || "#"
                        }`}
                        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {item.title || item.variant?.product?.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.variant?.title}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                              // TODO: Implement quantity update
                            }}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                              // TODO: Implement quantity update
                            }}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => {
                            // TODO: Implement remove item
                          }}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(
                          item.subtotal || item.unit_price * item.quantity
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-sm text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(cart.total || cart.subtotal || 0)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full px-6 py-3 text-center text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block w-full px-6 py-3 text-center text-base font-medium text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Secure cryptocurrency payments accepted
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
