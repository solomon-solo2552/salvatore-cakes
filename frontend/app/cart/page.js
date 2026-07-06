"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

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
          <div key={item.id} className="card flex items-center gap-4 p-4">
            <div className="w-20 h-20 rounded-xl bg-blush/20 flex items-center justify-center text-xs text-center text-espresso/50 font-display">
              {item.name}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-display text-lg text-espresso hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-cocoa/60">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center border border-espresso/20 rounded-full overflow-hidden">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 hover:bg-espresso/5"
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 hover:bg-espresso/5"
              >
                +
              </button>
            </div>
            <span className="w-20 text-right font-semibold text-espresso">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-blushdark text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-espresso/10 pt-6">
        <span className="font-display text-2xl text-espresso">
          Total: ${total.toFixed(2)}
        </span>
        <Link href="/checkout" className="btn-primary">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
