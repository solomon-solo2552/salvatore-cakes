"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { CATEGORY_OPTIONS, CATEGORY_SLUGS } from "@/lib/constants";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORY_SLUGS.CELEBRATION,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}/`);
        setForm({
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || "",
          category: res.data.category?.slug || CATEGORY_SLUGS.CELEBRATION,
        });
      } catch (err) {
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category_slug", form.category);
    if (image) data.append("image", image);

    try {
      await api.patch(`/products/${productId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cake details updated!");
      router.push("/admin/products");
    } catch (err) {
      toast.error("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-stone-500 font-bold animate-pulse">Loading cake data...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Edit Cake Listing</h1>
        <p className="text-xs font-semibold text-stone-500 mt-1">Modify cake name, price, or photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Cake Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Price ($)</label>
            <input
              required
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:outline-none bg-stone-50"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Update Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-xs text-stone-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-stone-900 text-amber-400 font-bold rounded-xl hover:bg-stone-800 transition"
        >
          {saving ? "Saving Changes..." : "Save Product Changes"}
        </button>
      </form>
    </div>
  );
}