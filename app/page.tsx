"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Color {
  id: string;
  name: string;
  hex: string;
  image?: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  colors: Color[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("void_wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => {
        if (category === "Basic Tees") return p.name.includes("Classic");
        if (category === "Oversized Tees") return p.name.includes("Oversized");
        if (category === "Graphic Tees") return p.name.includes("Graphic");
        if (category === "Limited Edition") return p.name.includes("Signature");
        return true;
      });
      setFilteredProducts(filtered);
    }
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem("void_wishlist", JSON.stringify(updated));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setContactSuccess(false), 3000);
    }
  };

  const categories = [
    { name: "All", count: products.length },
    { name: "Basic Tees", tag: "Basic", desc: "Everyday rotation essentials" },
    { name: "Oversized Tees", tag: "Oversized", desc: "Relaxed streetwear cuts" },
    { name: "Graphic Tees", tag: "Graphic", desc: "Seasonal custom typography" },
    { name: "Limited Edition", tag: "Limited", desc: "Micro-embellished exclusives" },
  ];

  return (
    <div className="bg-zinc-950 text-neutral-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-25"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8 animate-fade-in">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Summer / Autumn 2026 Collection
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            LESS IS ALL
          </h1>
          <p className="text-sm md:text-lg text-neutral-400 font-medium max-w-xl mx-auto tracking-wide leading-relaxed">
            Premium minimal organic cotton t-shirts designed for everyday wear. Heavyweight fabrics, custom drapes, and streetwear silhouettes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="#shop"
              className="w-full sm:w-auto bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-4 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="#collections"
              className="w-full sm:w-auto border border-neutral-800 bg-zinc-900/50 backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-md hover:border-neutral-500 transition-colors"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* 2. COLLECTIONS / CATEGORIES SECTION */}
      <section id="collections" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Curated Silhouettes</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(1).map((cat) => (
            <a
              key={cat.name}
              href="#shop"
              onClick={() => handleCategorySelect(cat.name)}
              className="group relative block bg-zinc-900 border border-neutral-900 p-8 rounded-lg hover:border-neutral-600 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-zinc-800/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  {cat.tag}
                </span>
                <h3 className="text-lg font-black text-white uppercase group-hover:text-neutral-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-4 flex items-center text-xs font-bold text-white uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  Explore →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section id="shop" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Now Available</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Featured Pieces</h2>
          </div>
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-2 md:pb-0 md:border-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-full border transition-all ${
                  activeCategory === cat.name
                    ? "bg-white text-black border-white"
                    : "border-neutral-850 bg-zinc-900 text-neutral-400 hover:border-neutral-600 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="h-80 bg-zinc-900 rounded-lg"></div>
                <div className="h-4 bg-zinc-900 rounded w-2/3"></div>
                <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/40 rounded-lg border border-neutral-900">
            <p className="text-neutral-500 text-sm">No pieces match the selected category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col justify-between">
                <Link href={`/product/${product.id}`} className="block space-y-4 cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-zinc-900 border border-neutral-900 rounded-lg overflow-hidden transition-all duration-500">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-4 right-4 p-2 bg-zinc-950/80 backdrop-blur-sm text-neutral-400 hover:text-white rounded-full border border-neutral-850 hover:border-neutral-600 transition-colors z-20"
                      aria-label="Add to wishlist"
                    >
                      <svg
                        className={`h-4.5 w-4.5 ${wishlist.includes(product.id) ? "fill-white text-white" : ""}`}
                        fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </button>
                    
                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded border border-neutral-800 shadow-xl">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        {product.name}
                      </h3>
                      <span className="text-xs font-black text-neutral-400">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </Link>

                {/* Colors indicator */}
                <div className="flex gap-1.5 mt-3">
                  {product.colors.map((color) => (
                    <span
                      key={color.id}
                      className="w-3 h-3 rounded-full border border-neutral-800 block"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. LOOKBOOK / STYLE SECTION */}
      <section id="lookbook" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Visual Editorial</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Lookbook</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="group relative aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-neutral-900">
            <img
              src="/images/lookbook-1.png"
              alt="Model wearing Classic Black Tee"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">01 / FIT</span>
              <h3 className="text-lg font-black uppercase tracking-wide text-white">Everyday Comfort</h3>
              <p className="text-xs text-neutral-400 mt-2 font-medium">Cut to layer and drape effortlessly.</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="group relative aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
              alt="Model in Oversized Tee"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">02 / SHAPE</span>
              <h3 className="text-lg font-black uppercase tracking-wide text-white">Street-Ready Style</h3>
              <p className="text-xs text-neutral-400 mt-2 font-medium">Boxy cuts with dropping shoulders.</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="group relative aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop"
              alt="Close-up on graphic details"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">03 / DETAIL</span>
              <h3 className="text-lg font-black uppercase tracking-wide text-white">Minimal Design</h3>
              <p className="text-xs text-neutral-400 mt-2 font-medium">Typographic details with micro embellishments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="py-32 max-w-5xl mx-auto px-4 text-center space-y-8 border-b border-neutral-900">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block">
          Our Philosophy
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
          THE ART OF BASICS
        </h2>
        <p className="text-sm md:text-md text-neutral-400 max-w-2xl mx-auto leading-relaxed tracking-wide">
          At VØID Studio, we believe basics are the foundation of style. We discard excess, focusing purely on perfect cuts, custom-knit heavy organic cottons, and refined color tones. Every piece is constructed to be worn daily, aging beautifully, and maintaining its drape over a lifetime.
        </p>
        <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">
          Sustainably sourced. Combed organic cotton. Ethically tailored.
        </p>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 max-w-xl mx-auto px-4">
        <div className="space-y-4 mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Get in touch</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Contact Us</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Have questions about sizes, shipping, or collections? Send us a message and we will respond within 24 hours.
          </p>
        </div>

        {contactSuccess ? (
          <div className="bg-zinc-900 border border-neutral-850 p-6 rounded-lg text-center space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 text-white">
              ✓
            </div>
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">Message Received</h3>
            <p className="text-xs text-neutral-500">Thank you. We will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-zinc-900 border border-neutral-850 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded px-4 py-3 text-xs text-white outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-neutral-850 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded px-4 py-3 text-xs text-white outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Message</label>
              <textarea
                required
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-neutral-850 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded px-4 py-3 text-xs text-white outline-none resize-none transition-all"
                placeholder="Write your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}

        <div className="mt-16 pt-8 border-t border-neutral-900 text-center space-y-2 text-xs">
          <p className="text-neutral-500">Private client relations: <span className="text-neutral-400 font-semibold">support@void.studio</span></p>
          <p className="text-neutral-500">Corporate HQ: <span className="text-neutral-400">Void Apparel Ltd, London, UK</span></p>
        </div>
      </section>
    </div>
  );
}