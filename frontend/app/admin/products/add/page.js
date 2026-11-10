"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { CATEGORY_OPTIONS, CATEGORY_SLUGS } from "@/lib/constants";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: CATEGORY_SLUGS.CELEBRATION,
    is_featured: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("slug", form.slug || form.name.toLowerCase().replace(/\s+/g, "-"));
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category_slug", form.category);
    data.append("is_featured", form.is_featured);
    if (image) data.append("image", image);

    try {
      await api.post("/products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cake added to the shop catalog!");
      router.push("/admin/products");
    } catch (err) {
      toast.error("Failed to publish cake listing. Please check required fields.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Add New Cake Listing</h1>
          <p className="text-sm font-semibold text-stone-500 mt-1">
            Publish fresh bakery creations directly to the storefront menu
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-stone-100 text-stone-800 font-bold rounded-xl hover:bg-stone-200 transition text-xs border border-stone-300"
        >
          ← Back to Cake Catalog
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-stone-600">
              Cake Display Photo
            </label>
            <div className="relative aspect-square rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-amber-400 transition flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2">🧁</span>
                  <span className="text-xs font-bold text-stone-600 block">Upload Photo</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">PNG, JPG, WEBP</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="text-xs font-bold text-red-600 hover:underline block text-center w-full"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Cake Title
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pistachio Raspberry Rose Sponge"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-amber-400 text-stone-900 font-semibold text-sm transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">
                  Price ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="34.50"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-amber-400 text-stone-900 font-bold text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-amber-400 text-stone-900 font-bold text-sm bg-stone-50 cursor-pointer transition"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Description & Flavor Profile
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe sponge layers, buttercream frosting, organic ingredients, allergen notes..."
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-amber-400 text-stone-900 font-medium text-sm transition resize-none"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-stone-300"
              />
              <span className="text-xs font-bold text-stone-800">
                Mark as Featured Bakery Favorite (Highlights on Homepage)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-stone-100 flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-3.5 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-stone-900 text-amber-400 font-black rounded-xl hover:bg-stone-800 disabled:opacity-50 transition text-sm shadow-md"
          >
            {loading ? "Publishing Cake..." : "Publish Cake Listing ✨"}
          </button>
        </div>
      </form>
    </div>
  );
}