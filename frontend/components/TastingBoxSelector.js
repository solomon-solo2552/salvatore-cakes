"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import api from "@/lib/api";
import { TASTING_BOX_NAME, TASTING_BOX_PRICE } from "@/lib/constants";
import { toast } from "sonner";

const FLAVOR_OPTIONS = [
  {
    id: "dark_truffle",
    name: "Nocturne Dark Truffle",
    desc: "Rich 70% single-origin cocoa ganache with velvet sponge.",
    badge: "Bestseller",
    emoji: "🍫",
  },
  {
    id: "tuscan_vanilla",
    name: "Tuscan Vanilla & Wild Lavender",
    desc: "Light floral infusion with pure Madagascar vanilla bean.",
    badge: "Heritage",
    emoji: "🌿",
  },
  {
    id: "rose_champagne",
    name: "Rose Champagne & Raspberry",
    desc: "Moist blush sponge layered with fresh tart raspberry preserve.",
    badge: "Wedding Favorite",
    emoji: "🌹",
  },
  {
    id: "pistachio_praline",
    name: "Pistachio Praline & Espresso",
    desc: "Roasted Sicilian pistachio buttercream with espresso crunch.",
    badge: "Chef's Pick",
    emoji: "☕",
  },
  {
    id: "red_velvet",
    name: "Classic Velvet & Cream Cheese",
    desc: "Silky traditional red velvet crumb with whipped mascarpone.",
    badge: "Classic",
    emoji: "🍰",
  },
  {
    id: "lemon_limoncello",
    name: "Limoncello & Meyer Lemon",
    desc: "Zesty citrus curd layered inside fluffy chiffon cake.",
    badge: "Seasonal",
    emoji: "🍋",
  },
];

export default function TastingBoxSelector() {
  const [selected, setSelected] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [boxProduct, setBoxProduct] = useState(null);
  const { addToCart } = useCart();

  // Fetch the real tasting box product ID once on mount
  useEffect(() => {
    api
      .get("/products/the-salvatore-curated-tasting-box/")
      .then((res) => {
        if (res.data) setBoxProduct(res.data);
      })
      .catch((err) => {
        console.error("Failed to load Tasting Box product:", err);
      });
  }, []);

  const toggleFlavor = (flavor) => {
    if (selected.find((item) => item.id === flavor.id)) {
      setSelected(selected.filter((item) => item.id !== flavor.id));
    } else {
      if (selected.length < 4) {
        setSelected([...selected, flavor]);
      }
    }
  };

  const handleAddToCart = () => {
    if (selected.length !== 4) return;
    if (!boxProduct) {
      toast.error("Tasting Box is currently being prepared. Please refresh and try again.");
      return;
    }

    const boxItem = {
      id: boxProduct.id,                 // ← real numeric product ID
      name: TASTING_BOX_NAME,
      slug: boxProduct.slug,
      price: Number(boxProduct.current_price ?? TASTING_BOX_PRICE),
      image: boxProduct.image || "/salvatore-cakes-og-logo.png",
      details: selected.map((f) => f.name).join(", "),
      quantity: 1,
    };

    addToCart(boxItem);
    toast.success("Tasting Box added to your bag!");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
  };

  return (
    <div className="space-y-10">
      {/* SELECTION COUNTER HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-espresso/15 p-6 rounded-3xl shadow-sm gap-4">
        <div>
          <h3 className="font-display text-xl text-espresso font-black">
            Build Your 4-Slice Tasting Box
          </h3>
          <p className="text-xs text-espresso/70 font-semibold">
            Choose exactly 4 flavors to be baked and shipped in mini-slice form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-amber-800">
            {selected.length} / 4
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-espresso/60">
            Flavors Picked
          </span>
        </div>
      </div>

      {/* FLAVOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FLAVOR_OPTIONS.map((flavor) => {
          const isSelected = selected.some((item) => item.id === flavor.id);
          const isDisabled = !isSelected && selected.length >= 4;

          return (
            <div
              key={flavor.id}
              onClick={() => !isDisabled && toggleFlavor(flavor)}
              className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${isSelected
                  ? "bg-amber-50/80 border-amber-600 shadow-md scale-[1.02]"
                  : isDisabled
                    ? "bg-stone-100 border-stone-200 opacity-50 cursor-not-allowed"
                    : "bg-white border-espresso/15 hover:border-espresso/40 hover:shadow-sm"
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{flavor.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-espresso/5 text-amber-900 border border-espresso/10 px-2.5 py-1 rounded-full">
                    {flavor.badge}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-black text-espresso">
                    {flavor.name}
                  </h4>
                  <p className="text-xs text-espresso/75 font-medium mt-1 leading-relaxed">
                    {flavor.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-espresso/10 flex items-center justify-between">
                <span className="text-xs font-extrabold text-espresso">
                  {isSelected ? "Selected ✓" : "Click to select"}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs ${isSelected
                      ? "bg-amber-700 border-amber-700 text-white"
                      : "border-espresso/30 text-transparent"
                    }`}
                >
                  ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD TO CART ACTION BANNER */}
      <div className="bg-[#2B1B17] rounded-3xl p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-amber-900/40">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block">
            Special Tasting Rebate
          </span>
          <h4 className="font-display text-2xl font-black text-white">
            The Salvatore Tasting Box — ${TASTING_BOX_PRICE.toFixed(2)}
          </h4>
          <p className="text-xs text-amber-100/80 font-medium max-w-lg">
            Includes 4 fresh artisan mini slices + a ${TASTING_BOX_PRICE.toFixed(0)} credit voucher valid toward your future celebration cake order ($150+).
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={selected.length !== 4 || !boxProduct}
          className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-lg whitespace-nowrap ${selected.length === 4 && boxProduct
              ? "bg-amber-500 hover:bg-amber-600 text-[#2B1B17] hover:scale-105 cursor-pointer"
              : "bg-stone-700 text-stone-400 cursor-not-allowed"
            }`}
        >
          {addedToCart
            ? "Added to Bag! 🍰"
            : selected.length === 4
              ? `Add Tasting Box ($${TASTING_BOX_PRICE.toFixed(0)})`
              : `Pick ${4 - selected.length} More Flavor${4 - selected.length > 1 ? "s" : ""
              }`}
        </button>
      </div>
    </div>
  );
}