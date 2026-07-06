"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-espresso/20 rounded-full overflow-hidden">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2 hover:bg-espresso/5"
        >
          −
        </button>
        <span className="px-4">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-4 py-2 hover:bg-espresso/5"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="btn-primary flex-1 disabled:opacity-40"
      >
        {added ? "Added ✓" : product.in_stock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
