"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
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
          setCart(cartData);
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      }
      setIsLoading(false);
    }

    loadCart();
  }, [cartId]);

  const items = useMemo(() => cart?.cart?.items ?? [], [cart?.cart?.items]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Retrieving your cart…</p>
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="bg-slate-50">
      <section className="section-padding pt-0">
        <div className="container-custom space-y-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <span className="badge-soft bg-primary-100 text-primary-800">
                Cart overview
              </span>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Review your order
              </h1>
              <p className="text-sm text-slate-600">
                Manage quantities, verify totals, and proceed to
                secure checkout.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2 text-sm font-medium text-primary-700">
              <ShieldCheck className="h-4 w-4" />
              Cryptocurrency payments protected
            </div>
          </div>

          {isEmpty ? (
            <div className="card-surface flex flex-col items-center gap-4 px-10 py-16 text-center">
              <ShoppingBag className="h-14 w-14 text-primary-300" />
              <h2 className="text-xl font-semibold text-slate-900">
                Your cart is currently empty
              </h2>
              <p className="max-w-md text-sm text-slate-500">
                Browse our catalog to add products and view
                personalized pricing.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                Browse products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6">
                {items.map((item: any) => (
                  <div key={item.id} className="card-surface flex gap-6 p-6">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {item.variant?.product?.thumbnail ? (
                        <Image
                          src={item.variant.product.thumbnail}
                          alt={item.title}
                          fill
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <Link
                          href={`/products/${
                            item.variant?.product?.handle ?? ""
                          }`}
                          className="text-base font-semibold text-slate-900 hover:text-primary-600"
                        >
                          {item.title ?? item.variant?.product?.title}
                        </Link>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {item.variant?.title}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                            onClick={() => {
                              // TODO: Implement quantity decrement
                            }}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center font-semibold text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                            onClick={() => {
                              // TODO: Implement quantity increment
                            }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            // TODO: Implement remove item
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-semibold text-slate-900">
                        {formatPrice(
                          item.subtotal ?? item.unit_price * item.quantity
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="card-surface h-fit space-y-6 p-6 lg:sticky lg:top-28">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Order summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    Taxes and duties calculated at checkout when applicable.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart?.cart?.subtotal ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="text-xs text-slate-400">
                      Calculated after address verification
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                    <span>Total due</span>
                    <span>
                      {formatPrice(
                        cart?.cart?.total ?? cart?.cart?.subtotal ?? 0
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-500"
                  >
                    Proceed to secure checkout
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex w-full items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50"
                  >
                    Continue shopping
                  </Link>
                </div>

                <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-xs text-primary-700">
                  Cryptocurrency payments are confirmed instantly with full
                  privacy.
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
