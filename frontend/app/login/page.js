"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Authenticate user and receive fresh user object
      const loggedInUser = await login(form.email, form.password);

      // 2. ⚡ Direct hard navigation forces a clean context mount on attempt #1
      if (loggedInUser && (loggedInUser.is_staff || loggedInUser.is_superuser)) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profile";
      }
      
    } catch (err) {
      console.error("Login debug error:", err.response?.data || err.message || err);
      setError("Invalid login credentials. Please check your email and password.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-espresso mb-2">Welcome back</h1>
      <p className="text-cocoa/70 mb-8">Log in to track orders and check out faster.</p>

      {/* 
        Adding method="post" and action="#" gives a clear semantic hint 
        to password managers that this is a true authentication gate.
      */}
      <form onSubmit={handleSubmit} method="post" action="#" className="space-y-4">
        <input 
          required 
          type="email" 
          name="email" 
          placeholder="Email address" 
          autoComplete="email"
          value={form.email} 
          onChange={handleChange} 
          className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" 
        />
        
        <div>
          <input 
            required 
            type="password" 
            name="password" 
            placeholder="Password" 
            autoComplete="current-password"
            value={form.password} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" 
          />
          
          <div className="text-right mt-1">
            <Link href="/forgot-password" className="text-xs text-cocoa/60 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-blushdark text-sm">{error}</p>}
        
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50 mt-2">
          {submitting ? "Authenticating..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-espresso/10"></div>
          <span className="mx-4 text-cocoa/40 text-xs uppercase">Or sign in with</span>
          <div className="flex-grow border-t border-espresso/10"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => toast.info("Google sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40 transition">Google</button>
          <button type="button" onClick={() => toast.info("Facebook sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40 transition">Facebook</button>
          <button type="button" onClick={() => toast.info("Instagram sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40 transition">Instagram</button>
        </div>

        <p className="text-sm text-cocoa/70 pt-4">
          New to Salvatore Cakes?{" "}
          <Link href="/register" className="underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}