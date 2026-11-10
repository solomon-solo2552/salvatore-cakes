"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/apiUrl";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/products/?page=${page}`);

      if (res.data.results) {
        setProducts(res.data.results);
        setTotalCount(res.data.count);
        setHasNext(!!res.data.next);
        setHasPrev(!!res.data.previous);
      } else {
        setProducts(res.data);
        setTotalCount(res.data.length);
        setHasNext(false);
        setHasPrev(false);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async (id, name) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${name}" from the bakery menu?`
    );
    if (!shouldDelete) return;

    try {
      await api.delete(`/products/${id}/`);
      toast.success(`"${name}" deleted from the menu`);
      fetchProducts(currentPage);
    } catch (err) {
      toast.error("Failed to delete products.");
    }
  };

  const totalPages = Math.ceil(totalCount / 12) || 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Cake Catalog</h1>
          <p className="text-sm font-semibold text-stone-500 mt-1">
            Total Cakes: <strong className="text-stone-900">{totalCount}</strong> | Showing Page {currentPage} of {totalPages}
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="px-5 py-3 bg-amber-400 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition text-sm shadow-sm flex items-center justify-center gap-2"
        >
          ➕ Add New Cake
        </Link>
      </div>

      {/* GRID VIEW WORKSPACE */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-stone-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-stone-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🎂"
          title="No cakes found"
          description="Add your first cake to the catalog to get started."
          actionLabel="Add New Cake"
          actionHref="/admin/products/add"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* CAKE IMAGE HEADER */}
                <div className="relative aspect-square bg-stone-100 border-b-2 border-stone-100 overflow-hidden">
                  {getImageUrl(product.image) ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🍰</div>
                  )}

                  {/* PRICE BADGE */}
                  <span className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur text-amber-400 text-xs font-black px-3 py-1.5 rounded-xl border border-stone-700 shadow-md">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* CARD INFO */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 inline-block">
                    {product.category?.replace(/-/g, " ") || "Cake"}
                  </span>

                  <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs font-medium text-stone-500 line-clamp-2 leading-relaxed">
                    {product.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="w-full py-2 bg-stone-100 text-stone-800 font-bold rounded-xl hover:bg-stone-200 transition text-xs text-center border border-stone-200"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="w-full py-2 bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition text-xs text-center"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⬅️ PAGINATION CONTROL FOOTER ➡️ */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-sm flex items-center justify-between">
        <button
          disabled={!hasPrev || currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-5 py-2.5 bg-stone-900 text-amber-400 font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition text-xs"
        >
          ← Previous Page
        </button>

        <span className="text-xs font-bold text-stone-600">
          Page <strong className="text-stone-900">{currentPage}</strong> of <strong className="text-stone-900">{totalPages}</strong>
        </span>

        <button
          disabled={!hasNext}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-5 py-2.5 bg-stone-900 text-amber-400 font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition text-xs"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}