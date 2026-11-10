"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import ProductCard from "@/components/ProductCard";
import HouseOfSalvatore from "@/components/HouseOfSalvatore";
import api from "@/lib/api";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // 👑 AUTOMATIC REDIRECT: Staff/Admins visiting "/" go straight to Kitchen Admin
    if (!authLoading && user && (user.is_staff || user.is_superuser)) {
      router.push("/admin/orders");
      return;
    }

    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products/", { params: { is_featured: true } });
        setFeatured(res.data.results || res.data || []);
      } catch (e) {
        console.error("Failed to load featured products:", e);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeatured();
  }, [user, authLoading, router]);

  if (authLoading || (user && (user.is_staff || user.is_superuser))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-amber-100 font-bold">
        <p className="animate-pulse tracking-wide text-lg">⚡ Opening Kitchen Admin Console...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-blushdark mb-4">
            Est. Salvatore Family Bakery
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-espresso">
            Cakes worth
            <br /> the celebration.
          </h1>
          <svg className="swirl-divider" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
              stroke="#C9A15A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-cocoa/80 max-w-md mb-8">
            Every cake is piped, layered and boxed by hand the same morning it's
            delivered — birthdays, weddings, and just-because Tuesdays alike.
          </p>
          <div className="flex gap-4">
            <Link href="/shop" className="btn-primary">Shop the bakery</Link>
            <Link href="/shop?category=custom-cakes" className="btn-secondary">Wedding cakes</Link>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-blush/40 to-gold/30 flex items-center justify-center p-8 overflow-hidden shadow-sm">
          <img 
            src="/salvatore-cakes-og-logo.png"
            alt="Salvatore Family Bakery Logo" 
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-espresso">Bakery favorites</h2>
            <svg className="swirl-divider" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
                stroke="#D98C93"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Link href="/shop" className="text-sm underline text-cocoa hover:text-espresso">
            View all cakes
          </Link>
        </div>

        {loadingProducts ? (
          <p className="text-cocoa/60 animate-pulse">Loading bakery products...</p>
        ) : featured.length === 0 ? (
          <p className="text-cocoa/60">
            No featured cakes yet — run the seed command on the backend to populate the shop.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 👑 THE HOUSE OF SALVATORE SECTION */}
      <HouseOfSalvatore />
    </div>
  );
}