"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import api from "@/lib/api";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    delivery_date: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Log in to check out</h1>
        <p className="text-cocoa/70 mb-8">
          Create an account or log in so we can save your order and delivery details.
        </p>
        <a href="/login" className="btn-primary">Log in</a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Your cart is empty</h1>
        <a href="/shop" className="btn-primary">Browse the bakery</a>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        delivery_date: form.delivery_date || null,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      };
      const res = await api.post("/orders/", payload);
      clearCart();
      router.push(`/account/orders?placed=${res.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong placing your order. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <input required name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />
        <input required name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />
        <input required name="address_line" placeholder="Delivery address" value={form.address_line} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />
        <input required name="city" placeholder="City" value={form.city} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        <input required name="postal_code" placeholder="Postal code" value={form.postal_code} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        <input required name="country" placeholder="Country" value={form.country} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />
        <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />
        <textarea name="notes" placeholder="Special instructions (cake message, allergies, etc.)"
          value={form.notes} onChange={handleChange} rows={3}
          className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 sm:col-span-2" />

        {error && <p className="text-blushdark text-sm sm:col-span-2">{error}</p>}

        <div className="sm:col-span-2 flex items-center justify-between border-t border-espresso/10 pt-6 mt-2">
          <span className="font-display text-2xl text-espresso">Total: ${total.toFixed(2)}</span>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
