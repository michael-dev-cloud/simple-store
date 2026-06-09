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
        setError("No session ID found in request.");
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
          setError(data.error || "Failed to fetch order details.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams.session_id, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Retrieving order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 py-16 flex flex-col justify-center items-center px-4">
      <div className="max-w-2xl w-full bg-zinc-900 border border-neutral-900 rounded-lg p-8 md:p-12 space-y-10">
        {error ? (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-950/40 border border-red-900 rounded-full text-red-500 font-bold text-lg">
              !
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase text-white tracking-tight">Order Verification Failed</h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{error}</p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
              >
                Back to Store
              </Link>
            </div>
          </div>
        ) : orderData ? (
          <>
            {/* Checked Success Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-950/40 border border-emerald-900 rounded-full text-emerald-400 font-bold text-lg animate-pulse">
                ✓
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Payment Complete
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  Welcome to the VØID
                </h1>
                <p className="text-xs text-neutral-500">
                  Your order has been received. A confirmation has been sent to <span className="text-neutral-300 font-semibold">{orderData.email}</span>.
                </p>
              </div>
            </div>

            {/* Shipment Progress Stepper */}
            <div className="py-6 border-t border-b border-neutral-950">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 text-center mb-6">
                Shipment Progress
              </h3>
              <div className="grid grid-cols-4 relative text-center">
                {/* Connector line */}
                <div className="absolute top-2.5 left-[12.5%] right-[12.5%] h-0.5 bg-neutral-800 -z-10">
                  <div className="h-full bg-white w-1/3 transition-all"></div>
                </div>
                {/* Step 1 */}
                <div className="space-y-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center mx-auto border border-neutral-900">
                    1
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white">Placed</p>
                </div>
                {/* Step 2 */}
                <div className="space-y-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-zinc-900 text-white text-[9px] font-black flex items-center justify-center mx-auto border border-white">
                    2
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white">Processing</p>
                </div>
                {/* Step 3 */}
                <div className="space-y-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-zinc-950 text-neutral-500 text-[9px] font-black flex items-center justify-center mx-auto border border-neutral-850">
                    3
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Dispatched</p>
                </div>
                {/* Step 4 */}
                <div className="space-y-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-zinc-950 text-neutral-500 text-[9px] font-black flex items-center justify-center mx-auto border border-neutral-850">
                    4
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Delivered</p>
                </div>
              </div>
            </div>

            {/* Order Details Details */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-neutral-950">
                Order Summary
              </h2>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Order Reference</p>
                  <p className="font-semibold text-neutral-300 mt-1">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Stripe Payment ID</p>
                  <p className="font-semibold text-neutral-300 mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                    {orderData.stripeId}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-4 border-t border-neutral-950 space-y-3">
                <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Items Purchased</p>
                <div className="divide-y divide-neutral-950/50">
                  {orderData.items && orderData.items.length > 0 ? (
                    orderData.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-white uppercase tracking-wider">
                            {item.productName || `Piece #${item.productId.substring(0,6)}`}
                          </p>
                          <div className="flex gap-2 text-[9px] uppercase font-semibold text-neutral-500">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                          </div>
                        </div>
                        <span className="font-black text-neutral-400">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500">No details available.</p>
                  )}
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-950">
                <span className="text-xs font-bold uppercase tracking-wider text-white">Amount Paid</span>
                <span className="text-lg font-black text-white">${orderData.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions button */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded hover:bg-neutral-200 text-center transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-neutral-550 text-sm">No order information found.</p>
            <div className="pt-4">
              <Link
                href="/"
                className="bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
              >
                Back to Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
