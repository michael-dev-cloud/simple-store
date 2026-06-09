"use client";

import Link from "next/link";
import { useCart } from "@/app/store/useCartStore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { items } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle hydration mismatch for Zustand state
  useEffect(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  }, [items]);

  const navLinks = [
    { name: "Shop", href: "/#shop" },
    { name: "Collections", href: "/#collections" },
    { name: "Lookbook", href: "/#lookbook" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="text-lg font-black tracking-widest text-white uppercase hover:text-neutral-400 transition-colors"
        >
          VØID<span className="text-zinc-500 font-light">.STUDIO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Items */}
        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="Cart"
          >
            {/* Shopping Bag Icon */}
            <svg
              className="h-5.5 w-5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {/* Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black ring-1 ring-zinc-950 animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white md:hidden transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-900 bg-zinc-950 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium uppercase tracking-wider text-neutral-300 hover:text-white py-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
