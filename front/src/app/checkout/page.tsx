"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, Truck, MapPin, Check, Bitcoin, Wallet } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUserStore } from "@/lib/store/user-store";
import * as checkoutApi from "@/lib/medusa/checkout";
import { paymentManager } from "@/lib/payments/payment-manager";
import type { PaymentProvider } from "@/lib/payments/types";
import { formatPrice } from "@/lib/utils/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartId, itemCount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useUserStore();

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">(
    "shipping"
  );
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);

  const [shippingAddress, setShippingAddress] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "US",
    phone: user?.phone || "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  useEffect(() => {
    if (!cartId || itemCount === 0) {
      router.push("/cart");
      return;
    }

    // Load checkout session and payment providers
    loadCheckoutSession();
    loadPaymentProviders();
  }, [cartId, itemCount, router]);

  const loadPaymentProviders = () => {
    const providers = paymentManager.getEnabledProviders();
    setPaymentProviders(providers);
  };

  const loadCheckoutSession = async () => {
    if (!cartId) return;

    try {
      setLoading(true);
      const data = await checkoutApi.createCheckoutSession(cartId);
      setCheckoutData(data);
    } catch (error) {
      console.error("Failed to load checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartId) return;

    try {
      setLoading(true);
      await checkoutApi.updateShippingAddress(cartId, shippingAddress);
      setStep("payment");
    } catch (error) {
      console.error("Failed to update shipping address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartId || !selectedPaymentMethod) return;

    try {
      setLoading(true);

      // Create payment session with the selected provider
      const paymentSession = await paymentManager.createPayment({
        providerId: selectedPaymentMethod,
        orderId: cartId,
        amount: cart?.total ? cart.total / 100 : 0,
        currency: cart?.currency_code || "USD",
        description: `Order ${cartId}`,
        customerEmail: user?.email,
      });

      // For fake provider, auto-complete after delay
      if (selectedPaymentMethod === "fake") {
        // Wait a bit for the fake payment to complete
        await new Promise((resolve) => setTimeout(resolve, 3500));
        
        // Complete the order
        await checkoutApi.completeOrder(cartId);
        
        // Clear cart and redirect to confirmation
        clearCart();
        router.push(`/checkout/confirmation?order=${cartId}&payment=${paymentSession.id}`);
      } else {
        // For real payment providers, redirect to payment URL
        if (paymentSession.paymentUrl) {
          window.location.href = paymentSession.paymentUrl;
        } else {
          throw new Error("Payment URL not provided");
        }
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading && !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Checkout Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load checkout session. Please try again.
          </p>
          <Link
            href="/cart"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  const { cart, paymentMethods } = checkoutData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom">
          <div className="py-6">
            <Link
              href="/cart"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center ${
                  step === "shipping"
                    ? "text-primary-600"
                    : step === "payment" || step === "confirmation"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "shipping"
                      ? "bg-primary-600 text-white"
                      : step === "payment" || step === "confirmation"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {step === "payment" || step === "confirmation" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "1"
                  )}
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div
                className={`w-16 h-0.5 mx-4 ${
                  step === "payment" || step === "confirmation"
                    ? "bg-green-600"
                    : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  step === "payment"
                    ? "text-primary-600"
                    : step === "confirmation"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "payment"
                      ? "bg-primary-600 text-white"
                      : step === "confirmation"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {step === "confirmation" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "2"
                  )}
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "shipping" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Address
                    </h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          required
                          value={shippingAddress.first_name}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          required
                          value={shippingAddress.last_name}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address_1"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="address_1"
                        name="address_1"
                        required
                        value={shippingAddress.address_1}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address_2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="address_2"
                        name="address_2"
                        value={shippingAddress.address_2}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="province"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="province"
                          name="province"
                          value={shippingAddress.province}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          required
                          value={shippingAddress.postal_code}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center px-8 py-3 border border-black text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg min-w-[200px]"
                      >
                        {loading ? (
                          <>Saving...</>
                        ) : (
                          <>
                            Continue to Payment
                            <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {paymentProviders.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          No payment providers are currently configured.
                        </p>
                        <p className="text-sm text-gray-400">
                          Please contact support or configure payment providers.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedPaymentMethod === provider.id
                                ? "border-primary-600 bg-primary-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                            onClick={() => setSelectedPaymentMethod(provider.id)}
                          >
                            <div className="flex items-start">
                              <input
                                type="radio"
                                id={provider.id}
                                name="paymentMethod"
                                value={provider.id}
                                checked={selectedPaymentMethod === provider.id}
                                onChange={(e) =>
                                  setSelectedPaymentMethod(e.target.value)
                                }
                                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label
                                htmlFor={provider.id}
                                className="ml-3 flex-1 cursor-pointer"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-medium text-gray-900">
                                        {provider.name}
                                      </h3>
                                      {provider.testMode && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                          Test
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {provider.description}
                                    </p>
                                    {provider.supportedCurrencies.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {provider.supportedCurrencies
                                          .slice(0, 5)
                                          .map((currency) => (
                                            <span
                                              key={currency}
                                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                            >
                                              {currency}
                                            </span>
                                          ))}
                                        {provider.supportedCurrencies.length >
                                          5 && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                            +
                                            {provider.supportedCurrencies
                                              .length - 5}{" "}
                                            more
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {provider.id === "btcpay" && (
                                    <Bitcoin className="h-6 w-6 text-orange-500 flex-shrink-0" />
                                  )}
                                  {provider.id === "shkeeper" && (
                                    <Wallet className="h-6 w-6 text-blue-500 flex-shrink-0" />
                                  )}
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !selectedPaymentMethod}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? "Processing..." : "Complete Order"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  {checkoutData?.cart?.items && checkoutData.cart.items.length > 0 ? (
                    checkoutData.cart.items.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.title || item.product?.title || item.variant?.product?.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.variant?.title} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.subtotal || (item.unit_price * item.quantity))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Loading cart...</p>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(checkoutData?.cart?.total || checkoutData?.cart?.subtotal || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  <p className="mb-2">
                    <Truck className="inline h-3 w-3 mr-1" />
                    Free shipping on orders over $50
                  </p>
                  <p>
                    <CreditCard className="inline h-3 w-3 mr-1" />
                    Secure cryptocurrency payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
