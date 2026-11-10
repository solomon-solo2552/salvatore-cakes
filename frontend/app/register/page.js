"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setProfilePicture(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // 🔍 TEMPORARY DEBUG LOGGER
    console.log("Password state check:", {
      password: form.password,
      confirmPassword: form.confirmPassword
    });

    if (form.password.trim() !== form.confirmPassword.trim()) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key !== "confirmPassword") {
        formData.append(key, form[key]);
      }
    });
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
    try {
      await register(formData);
      toast.success("Account created! Welcome to Salvatore Cakes");
      router.push("/");
    } catch (err) {
      const data = err.response?.data;
      const message = data
        ? Object.values(data).flat().join(" ")
        : "Something went wrong.";
        setError(message);
        toast.error("Registration failed", { description: message, duration: 6000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-espresso mb-2">Create an account</h1>
      <p className="text-cocoa/70 mb-8">Sign up once for lightning-fast cake orders.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture Upload Input */}
        <div className="flex flex-col items-center gap-2 border border-dashed border-espresso/20 p-4 rounded-xl bg-white/30">
          <label className="text-xs font-medium text-cocoa/70 cursor-pointer hover:underline">
            📸 Upload Profile Picture
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {profilePicture && <span className="text-xs text-espresso font-semibold truncate max-w-xs">{profilePicture.name}</span>}
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-2 gap-4">
          <input required name="username" autoComplete="username" placeholder="Username" value={form.username} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
          <input required type="email" name="email" autoComplete="email" placeholder="Email" value={form.email} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="first_name" autoComplete="given-name" placeholder="First name" value={form.first_name} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
          <input name="last_name" autoComplete="family-name" placeholder="Last name" value={form.last_name} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
        </div>

        <input required name="phone" autoComplete="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
        <input required name="address_line" autoComplete="street-address" placeholder="Delivery address" value={form.address_line} onChange={handleChange} className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />

        <div className="grid grid-cols-3 gap-2">
          <input required name="city" autoComplete="address-level2" placeholder="City" value={form.city} onChange={handleChange} className="rounded-xl border border-espresso/20 px-3 py-3 bg-white/70 text-sm focus:outline-none" />
          <input required name="postal_code" autoComplete="postal-code" placeholder="Postal code" value={form.postal_code} onChange={handleChange} className="rounded-xl border border-espresso/20 px-3 py-3 bg-white/70 text-sm focus:outline-none" />
          <input required name="country" autoComplete="country-name" placeholder="Country" value={form.country} onChange={handleChange} className="rounded-xl border border-espresso/20 px-3 py-3 bg-white/70 text-sm focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input required type="password" name="password" autoComplete="new-password" placeholder="Password" value={form.password} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
          <input required type="password" name="confirmPassword" autoComplete="new-password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none" />
        </div>

        {error && <p className="text-blushdark text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50 mt-2">Create account</button>
      </form>

      {/* Auxiliary Links & Social Login Layout Options */}
      <div className="mt-6 text-center space-y-4">
        {/* ❌ Forgot Password Link Has Been Deleted From Here */}
        
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-espresso/10"></div>
          <span className="mx-4 text-cocoa/40 text-xs uppercase">Or sign in with</span>
          <div className="flex-grow border-t border-espresso/10"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => toast.info("Google sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40">Google</button>
          <button onClick={() => toast.info("Facebook sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40">Facebook</button>
          <button onClick={() => toast.info("Instagram sign-in is coming soon")} className="border border-espresso/20 rounded-xl py-2 text-xs font-medium hover:bg-white/40">Instagram</button>
        </div>

      <p className="text-sm text-cocoa/70 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline">Log in</Link>
      </p>
    </div>
    </div>
  );
}
