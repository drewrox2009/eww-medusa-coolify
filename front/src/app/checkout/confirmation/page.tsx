"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, CreditCard, Home } from "lucide-react";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // In a real app, you'd fetch the order details here
    // For now, we'll simulate order data
    setTimeout(() => {
      setOrder({
        id: orderId,
        status: "completed",
        total: 12500, // $125.00
        currency: "USD",
        items: [
          {
            product: { title: "Sildenafil Citrate" },
            variant: { title: "100mg - 30 pills" },
            quantity: 1,
            total: 7000, // $70.00
          },
          {
            product: { title: "Atorvastatin" },
            variant: { title: "20mg - 30 pills" },
            quantity: 1,
            total: 5500, // $55.00
          },
        ],
        shipping_address: {
          first_name: "John",
          last_name: "Doe",
          address_1: "123 Main St",
          city: "Anytown",
          postal_code: "12345",
          country_code: "US",
        },
        created_at: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your order. Please contact support if you believe
            this is an error.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Confirmation
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Thank you for your order! Your order has been successfully
                  placed.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 mt-1">
                  Your order #{order.id.slice(-8).toUpperCase()} has been placed
                  successfully.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Items
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.variant.title} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.total / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${(order.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h3>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shipping_address.first_name}{" "}
                    {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && (
                    <p>{order.shipping_address.address_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country_code}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h3>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Cryptocurrency Payment</p>
                  <p className="text-green-600 font-medium">
                    Payment Confirmed
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Next Steps */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          1
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Order Processing
                      </h4>
                      <p className="text-sm text-gray-500">
                        We'll process your order within 24 hours and send you a
                        confirmation email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          2
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Quality Check
                      </h4>
                      <p className="text-sm text-gray-500">
                        All medications undergo quality control before shipping.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          3
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Shipping
                      </h4>
                      <p className="text-sm text-gray-500">
                        Your order will be shipped within 2-3 business days with
                        tracking information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Actions
                </h3>

                <div className="space-y-3">
                  <Link
                    href="/account/orders"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Order History
                  </Link>

                  <Link
                    href="/products"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your order, please contact our
                  support team.
                </p>
                <a
                  href="mailto:support@oceanicapharma.com"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  support@oceanicapharma.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
