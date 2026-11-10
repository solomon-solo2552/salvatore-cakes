"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/apiUrl";

export default function LiveSearch({ defaultValue }) {
  const [query, setQuery] = useState(defaultValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch product suggestions from your Django filter backend as you type
  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get("/products/", { params: { search: query } });
        const items = res.data.results || res.data.items || (Array.isArray(res.data) ? res.data : []);
        setSuggestions(items);
        setIsOpen(true);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  const handleSelectSuggestion = (slug) => {
    setIsOpen(false);
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[200px]">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search cakes..."
          className="rounded-full border border-espresso/20 px-4 py-2 text-sm w-full bg-white/70 focus:outline-none focus:border-espresso"
          autoComplete="off"
        />
        <button type="submit" className="btn-secondary !py-2 text-sm">
          Search
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-espresso/10 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-espresso/5">
          {suggestions.map((product) => {
            const thumb = getImageUrl(product.image);
            return (
              <div
                key={product.id}
                onClick={() => handleSelectSuggestion(product.slug)}
                className="flex items-center gap-3 p-3 hover:bg-vanilla/50 cursor-pointer transition"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blush/20 rounded-lg flex items-center justify-center text-[10px] font-display text-espresso/50">
                    Cake
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-espresso truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-cocoa/60 flex gap-2">
                    <span>${Number(product.current_price).toFixed(2)}</span>
                    <span>•</span>
                    <span className={product.stock > 0 ? "text-cocoa/60" : "text-blushdark font-medium"}>
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}