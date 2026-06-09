"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full border-t border-neutral-900 bg-zinc-950 text-neutral-400">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">
            VØID STUDIO
          </h2>
          <p className="text-xs leading-relaxed max-w-xs text-neutral-500">
            A premium minimal apparel brand focusing on fit, fabric, and everyday comfort. Streetwear silhouettes made for longevity.
          </p>
        </div>

        {/* Navigation links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Collections
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#shop" className="hover:text-white transition-colors">Basic Tees</Link>
            </li>
            <li>
              <Link href="/#shop" className="hover:text-white transition-colors">Oversized Tees</Link>
            </li>
            <li>
              <Link href="/#shop" className="hover:text-white transition-colors">Graphic Tees</Link>
            </li>
            <li>
              <Link href="/#shop" className="hover:text-white transition-colors">Limited Edition</Link>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Brand
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#about" className="hover:text-white transition-colors">Story & Mission</Link>
            </li>
            <li>
              <Link href="/#lookbook" className="hover:text-white transition-colors">Lookbook</Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-white transition-colors">Contact Support</Link>
            </li>
            <li>
              <Link href="/admin/products" className="hover:text-white transition-colors text-neutral-600">Admin Panel</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Newsletter
          </h3>
          <p className="text-xs text-neutral-500">
            Sign up to receive release updates and private collections.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="flex border border-neutral-850 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-white focus-within:border-transparent transition-all">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-zinc-900 px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
              />
              <button
                type="submit"
                className="bg-white px-4 text-xs font-bold text-black hover:bg-neutral-200 transition-colors uppercase tracking-wider"
              >
                Join
              </button>
            </div>
            {subscribed && (
              <span className="text-[10px] font-medium text-emerald-500 animate-fade-in">
                Thank you for joining. Welcome to the VØID.
              </span>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-900 bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-600">
            &copy; {new Date().getFullYear()} VØID Studio. All rights reserved. Designed for minimal everyday wear.
          </p>

          {/* Social Handles */}
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Pinterest">
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
