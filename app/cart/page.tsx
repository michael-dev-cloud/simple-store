"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/store/useCartStore";

export default function CartPage() {
  const { items, getTotalPrice, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Loading bag...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link 
          href="/#shop" 
          className="inline-flex items-center text-xs font-semibold tracking-wider text-neutral-500 hover:text-white uppercase transition-colors"
        >
          ← Back to Collection
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-4">Shopping Bag</h1>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {items.length === 0 ? (
          <div className="bg-zinc-900 border border-neutral-900 rounded-lg p-16 text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-neutral-400">
              🛄
            </div>
            <p className="text-neutral-400 text-sm">Your shopping bag is currently empty.</p>
            <div>
              <Link
                href="/#shop"
                className="inline-block bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-6 p-6 bg-zinc-900 border border-neutral-900 rounded-lg relative"
                >
                  {/* Item Image */}
                  <div className="w-24 h-30 bg-zinc-950 border border-neutral-850 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          {item.productName}
                        </h3>
                        <span className="text-xs font-black text-neutral-300">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Configuration Tags */}
                      <div className="flex flex-wrap gap-2 pt-1.5 text-[10px] uppercase font-semibold text-neutral-400">
                        <span className="bg-zinc-950 px-2 py-1 rounded border border-neutral-850">
                          Color: {item.color}
                        </span>
                        <span className="bg-zinc-950 px-2 py-1 rounded border border-neutral-850">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Delete Actions */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-900/50">
                      <div className="flex items-center border border-neutral-850 rounded bg-zinc-950">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.color,
                              item.size,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1.5 text-neutral-500 hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.color,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1.5 text-neutral-500 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="text-neutral-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-neutral-900 rounded-lg p-8 sticky top-24 space-y-6">
                <h2 className="text-md font-bold uppercase tracking-wider text-white pb-4 border-b border-neutral-900">
                  Summary
                </h2>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">Free</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 pb-4 border-b border-neutral-900">
                    <span>Taxes</span>
                    <span className="text-white font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-2">
                    <span className="text-white uppercase tracking-wider">Total</span>
                    <span className="text-lg text-white font-black">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-zinc-950 border border-neutral-850 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded px-4 py-3 text-xs text-white outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-950/40 border border-red-900 text-red-400 p-4 rounded text-xs">
                    {error}
                  </div>
                )}

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>

                <p className="text-[10px] text-neutral-500 leading-relaxed text-center">
                  Payments are secure and processed via Stripe. Credit card information is never processed or stored on our servers.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
