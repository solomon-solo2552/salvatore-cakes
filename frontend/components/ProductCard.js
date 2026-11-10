"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { getImageUrl } from "@/lib/apiUrl";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="card group flex flex-col">
      <Link href={`/product/${product.slug}`} className="block aspect-square bg-blush/20 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cocoa/40 font-display text-lg">
            {product.name}
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-espresso">{product.name}</h3>
        </Link>
        <p className="text-xs uppercase tracking-wide text-cocoa/60 mt-1">{product.category}</p>
        {/* <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-espresso">${Number(product.current_price).toFixed(2)}</span>
          {product.discount_price && (
            <span className="text-sm text-cocoa/50 line-through">${Number(product.price).toFixed(2)}</span>
          )}
        </div> */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-espresso">${Number(product.current_price).toFixed(2)}</span>
          {product.discount_price && (
            <span className="text-sm text-cocoa/50 line-through">${Number(product.price).toFixed(2)}</span>
          )}
        </div>

        {/* ADD THIS SYSTEM INSIDE YOUR PRODUCT CARD COMPONENT */}
        <p className="text-xs text-cocoa/60 mt-2">
          {product.stock > 0 ? `Only ${product.stock} left in stock` : "Out of stock"}
        </p>
        <button
          onClick={() => addItem(product, 1)}
          disabled={!product.in_stock}
          className="btn-primary mt-4 w-full !py-2 text-sm disabled:opacity-40"
        >
          {product.in_stock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}
