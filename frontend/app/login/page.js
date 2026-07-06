"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.username, form.password);
      router.push("/");
    } catch (err) {
      setError("Incorrect username or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-espresso mb-2">Welcome back</h1>
      <p className="text-cocoa/70 mb-8">Log in to track orders and check out faster.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70"
        />
        {error && <p className="text-blushdark text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-cocoa/70 mt-6">
        New to Salvatore Cakes?{" "}
        <Link href="/register" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
