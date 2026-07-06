"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      router.push("/");
    } catch (err) {
      const data = err.response?.data;
      const message = data
        ? Object.values(data).flat().join(" ")
        : "Something went wrong creating your account.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-espresso mb-2">Create an account</h1>
      <p className="text-cocoa/70 mb-8">Order faster and track your cakes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input required name="username" placeholder="Username" value={form.username} onChange={handleChange}
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        <div className="grid grid-cols-2 gap-4">
          <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange}
            className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
          <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange}
            className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        </div>
        <input required type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70" />
        {error && <p className="text-blushdark text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-cocoa/70 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
