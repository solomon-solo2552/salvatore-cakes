"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/apiUrl";

export default function FilterForm({ defaultQ, defaultFlavor, category }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(defaultQ || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Close suggestions popover when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. LIVE DEBOUNCED SEARCH (FETCH SUGGESTIONS & UPDATE URL)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = searchTerm.trim();

      // Fetch suggestions if user typed at least 2 characters
      if (query.length >= 2) {
        try {
          const res = await api.get(`/products/?search=${encodeURIComponent(query)}`);
          const results = res.data.results || res.data || [];
          setSuggestions(results.slice(0, 5)); // Limit to top 5 suggestions
          setShowSuggestions(true);
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

      // Update the URL search parameters to dynamically filter the page grid
      const currentQInUrl = searchParams.get("q") || "";
      if (query !== currentQInUrl) {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set("q", query);
        } else {
          params.delete("q");
        }
        params.delete("page"); // Reset to page 1 on search change
        router.push(`/shop?${params.toString()}`);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router]);

  // Handle flavor selection changes
  const handleFlavorChange = (e) => {
    const selectedFlavor = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (selectedFlavor) {
      params.set("flavor", selectedFlavor);
    } else {
      params.delete("flavor");
    }

    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap gap-3 mb-10 relative">
      {category && <input type="hidden" name="category" value={category} />}

      {/* SEARCH INPUT & FLOATING SUGGESTIONS BOX */}
      <div ref={containerRef} className="relative flex-1 min-w-[220px]">
        <input
          type="text"
          name="q"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
          placeholder="Search cakes (e.g., Red Velvet, Chocolate)..."
          className="w-full rounded-full border border-espresso/20 px-4 py-2 text-sm bg-white/70 focus:outline-none focus:border-espresso"
          autoComplete="off"
        />

        {/* AUTOCOMPLETE SUGGESTIONS POPUP */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-espresso/10 z-50 overflow-hidden divide-y divide-espresso/5">
            {suggestions.map((cake) => {
              const thumb = getImageUrl(cake.image);
              return (
                <Link
                  key={cake.id}
                  href={`/product/${cake.slug || cake.id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 p-3 hover:bg-cream/30 transition text-left"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={cake.name}
                      className="w-10 h-10 object-cover rounded-lg border border-espresso/10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-cream/50 flex items-center justify-center rounded-lg text-lg">
                      🍰
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-sm text-espresso block truncate font-semibold">
                      {cake.name}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      ${Number(cake.price || 0).toFixed(2)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ⚡ INSTANT FLAVOR FILTER DROPDOWN */}
      <select
        name="flavor"
        defaultValue={defaultFlavor || ""}
        onChange={handleFlavorChange}
        className="rounded-full border border-espresso/20 px-4 py-2 text-sm bg-white/70 cursor-pointer font-medium text-espresso"
      >
        <option value="">All flavors</option>
        <option value="chocolate">Chocolate</option>
        <option value="vanilla">Vanilla</option>
        <option value="red_velvet">Red Velvet</option>
        <option value="cheesecake">Cheesecake</option>
        <option value="other">Loaf & Other</option>
      </select>
    </form>
  );
}