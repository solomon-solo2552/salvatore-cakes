"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { getImageUrl } from "@/lib/apiUrl";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Your cart is empty</h1>
        <p className="text-cocoa/70 mb-8">Time to pick out something sweet.</p>
        <Link href="/shop" className="btn-primary">Browse the bakery</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-8">Your Cart</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-4 border border-espresso/15 rounded-2xl bg-white shadow-sm">
            {/* THUMBNAIL IMAGE */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-blush/20 border border-espresso/10 flex-shrink-0">
              <img
                src={getImageUrl(item.image, "/salvatore-cakes-og-logo.png")}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* ITEM INFO & TASTING BOX DETAILS */}
            <div className="flex-1 min-w-0">
              {item.slug ? (
                <Link href={`/products/${item.slug}`} className="font-display text-lg text-espresso hover:underline block truncate font-bold">
                  {item.name}
                </Link>
              ) : (
                <span className="font-display text-lg text-espresso block truncate font-bold">
                  {item.name}
                </span>
              )}

              {/* 🟢 DISPLAYS SELECTED FLAVORS IF TASTING BOX */}
              {item.details && (
                <p className="text-xs text-amber-800 font-bold mt-1 bg-amber-50 border border-amber-200/60 rounded-lg px-2.5 py-1 inline-block">
                  Flavors: {item.details}
                </p>
              )}

              <p className="text-xs text-cocoa/70 font-semibold mt-1">
                ${Number(item.price).toFixed(2)} each
              </p>
            </div>

            {/* QUANTITY CONTROLS */}
            <div className="flex items-center border border-espresso/20 rounded-full overflow-hidden bg-white">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 hover:bg-espresso/5 font-bold"
              >
                −
              </button>
              <span className="px-3 text-sm font-bold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 hover:bg-espresso/5 font-bold"
              >
                +
              </button>
            </div>

            {/* ITEM TOTAL */}
            <span className="w-24 text-right font-bold text-espresso text-base">
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-amber-800 text-xs font-extrabold hover:underline pl-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-espresso/15 pt-6">
        <span className="font-display text-2xl text-espresso font-bold">
          Total: ${total.toFixed(2)}
        </span>
        <Link href="/checkout" className="btn-primary">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}