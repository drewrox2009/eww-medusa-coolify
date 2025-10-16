"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Loader2, Copy, ExternalLink } from "lucide-react";
import { paymentManager } from "@/lib/payments/payment-manager";
import type { PaymentSession } from "@/lib/payments/types";
import { formatPrice } from "@/lib/utils/format";
import * as checkoutApi from "@/lib/medusa/checkout";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.paymentId as string;

  const [payment, setPayment] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!paymentId) return;

    loadPaymentStatus();

    // Poll for payment status updates
    const interval = setInterval(loadPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [paymentId]);

  const loadPaymentStatus = async () => {
    try {
      // Extract provider ID from payment ID (format: providerId_timestamp_random)
      const providerId = paymentId.split("_")[0];
      
      const paymentStatus = await paymentManager.getPaymentStatus(
        providerId,
        paymentId
      );
      
      setPayment(paymentStatus);
      setLoading(false);

      // If payment is completed, complete the order and redirect to confirmation
      if (paymentStatus.status === "completed") {
        try {
          // Complete the cart using the proper Medusa workflow via our backend API
          const result = await checkoutApi.completeCart(paymentStatus.orderId);
          console.log("Order completed successfully:", result.order.id);
        } catch (completeError) {
          console.error("Failed to complete order:", completeError);
          // Continue with redirect even if completion fails
        }

        setTimeout(() => {
          router.push(
            `/checkout/confirmation?order=${paymentStatus.orderId}&payment=${paymentId}`
          );
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to load payment status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load payment status"
      );
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Payment not found</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (payment.status) {
      case "completed":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "failed":
      case "expired":
        return <XCircle className="h-16 w-16 text-red-500" />;
      case "processing":
        return <Clock className="h-16 w-16 text-blue-500" />;
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case "completed":
        return "Payment Completed";
      case "failed":
        return "Payment Failed";
      case "expired":
        return "Payment Expired";
      case "processing":
        return "Processing Payment";
      default:
        return "Awaiting Payment";
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case "completed":
        return "text-green-600";
      case "failed":
      case "expired":
        return "text-red-600";
      case "processing":
        return "text-blue-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Status Icon */}
            <div className="text-center mb-6">
              {getStatusIcon()}
              <h2 className={`text-2xl font-bold mt-4 ${getStatusColor()}`}>
                {getStatusText()}
              </h2>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-sm text-gray-900">
                  {payment.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(payment.amount * 100)} {payment.currency}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium capitalize ${getStatusColor()}`}
                >
                  {payment.status}
                </span>
              </div>

              {payment.address && (
                <div className="space-y-2">
                  <span className="text-gray-600 block">Payment Address:</span>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all text-gray-900">
                      {payment.address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(payment.address!)}
                      className="flex-shrink-0 p-2 hover:bg-gray-200 rounded transition"
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {payment.expiresAt && payment.status === "pending" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="text-gray-900">
                    {new Date(payment.expiresAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* QR Code */}
            {payment.qrCode && payment.status === "pending" && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Scan QR code to pay:
                </p>
                <img
                  src={payment.qrCode}
                  alt="Payment QR Code"
                  className="mx-auto border border-gray-200 rounded-lg"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {payment.paymentUrl &&
                payment.status === "pending" &&
                payment.providerId !== "fake" && (
                  <a
                    href={payment.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Open Payment Page
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}

              {payment.status === "pending" && (
                <div className="text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Waiting for payment confirmation...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This page will update automatically
                  </p>
                </div>
              )}

              {(payment.status === "failed" || payment.status === "expired") && (
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Try Again
                </Link>
              )}

              <Link
                href="/cart"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}