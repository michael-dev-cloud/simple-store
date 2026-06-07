"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/store/useCartStore";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!searchParams.session_id) {
        setError("No session found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout?session_id=${searchParams.session_id}`
        );
        const data = await res.json();

        if (res.ok) {
          setOrderData(data);
          clearCart();
        } else {
          setError(data.error || "Failed to fetch order");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams.session_id, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">T-Shirt Store</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Order Error</h2>
            <p className="mb-4">{error}</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Store
            </Link>
          </div>
        ) : orderData ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been received.
              </p>
            </div>

            {/* Order Details */}
            <div className="border-t border-b py-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Details
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {orderData.id.substring(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {orderData.email}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {orderData.items && orderData.items.length > 0 ? (
                    orderData.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          {item.color && ` (${item.color})`}
                        </span>
                        <span className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No items in order</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${orderData.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Your order has been received and confirmed</li>
                <li>✓ A confirmation email has been sent to {orderData.email}</li>
                <li>• Your order will be prepared for shipment</li>
                <li>• You'll receive a tracking number via email</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-bold"
              >
                Continue Shopping
              </Link>
              <a
                href={`mailto:${orderData.email}`}
                className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 text-center font-bold"
              >
                View Confirmation Email
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No order data found</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Store
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
