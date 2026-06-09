"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/app/store/useCartStore";
import Link from "next/link";

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

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`/api/products`);
        const products = await res.json();
        setAllProducts(products);
        const found = products.find((p: Product) => p.id === params.id);
        
        if (found) {
          setProduct(found);
          if (found.colors.length > 0) {
            setSelectedColor(found.colors[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || !selectedColor) {
      setError("Please select a color");
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: selectedColor.name,
      size: selectedSize,
      quantity,
      image: selectedColor.image || product.image,
    };

    addItem(cartItem);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Loading piece details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-6 text-center px-4">
        <p className="text-neutral-400 text-sm">{error || "Product not found"}</p>
        <Link 
          href="/" 
          className="text-xs font-bold uppercase tracking-wider text-white border border-neutral-800 bg-zinc-900 px-6 py-3 rounded hover:border-neutral-500 transition-colors"
        >
          Back to collection
        </Link>
      </div>
    );
  }

  // Filter out current product for the related section
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // Determine which image to display
  const activeImage = selectedColor?.image || product.image;

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 py-12">
      {/* Back button & Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-semibold tracking-wider text-neutral-500 hover:text-white uppercase transition-colors"
        >
          ← Back to Collection
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 border-b border-neutral-900 pb-24">
          {/* Left Column: Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-zinc-900 rounded-lg overflow-hidden border border-neutral-900 aspect-[4/5] relative">
              <img
                src={activeImage}
                alt={`${product.name} Preview`}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            {/* Swatch thumbnails below main image */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-16 h-20 rounded border bg-zinc-900 overflow-hidden transition-all duration-300 relative flex-shrink-0 ${
                    selectedColor?.id === color.id
                      ? "border-white ring-1 ring-white"
                      : "border-neutral-850 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={color.image || product.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Custom Configurator */}
          <div className="flex flex-col justify-center space-y-8 lg:max-w-md">
            {/* Header info */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Premium Apparel
              </span>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl font-black text-neutral-300">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-450 leading-relaxed pt-2 font-medium">
                {product.description}
              </p>
            </div>

            {/* Colors Swatches Selector */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <span>Color</span>
                <span className="text-white">{selectedColor?.name || "Select Color"}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center p-0.5 transition-all ${
                      selectedColor?.id === color.id
                        ? "border-white ring-1 ring-white"
                        : "border-neutral-850 hover:border-neutral-500"
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-full h-full rounded-full block border border-neutral-950"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Selector */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <span>Size</span>
                <span className="text-white">Selected: {selectedSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-bold uppercase rounded border transition-all ${
                      selectedSize === size
                        ? "bg-white text-black border-white"
                        : "border-neutral-850 text-neutral-400 hover:border-neutral-600 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Quantity
              </label>
              <div className="flex items-center w-32 border border-neutral-850 rounded bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-neutral-500 hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="flex-1 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-neutral-500 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Success & Error Feedbacks */}
            {error && (
              <div className="bg-red-950/40 border border-red-900 text-red-400 px-4 py-3 rounded text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-3 rounded text-xs animate-fade-in">
                ✓ Added to bag successfully!
              </div>
            )}

            {/* Add to Bag CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Add to Bag
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <span>✓</span> Free Shipping Worldwide
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span> 30-Day Draped Fit Returns
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="pt-24 space-y-12">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Complete the Look</span>
              <h2 className="text-2xl font-black uppercase text-white">Related Pieces</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group space-y-4 block">
                  <div className="relative aspect-[4/5] bg-zinc-900 border border-neutral-900 rounded-lg overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded border border-neutral-800">
                        View Piece
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        {p.name}
                      </h3>
                      <span className="text-xs font-black text-neutral-400">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}