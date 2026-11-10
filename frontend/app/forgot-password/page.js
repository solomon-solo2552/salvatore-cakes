"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // View states: false means ask for email, true means show OTP & new password input fields
  const [stepTwo, setStepTwo] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Request 6-digit code
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/accounts/forgot-password/", { email });
      setMessage(res.data.detail);
      setStepTwo(true); // Switch view to the OTP entry dashboard field form
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Submit Code along with new credentials parameters
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/accounts/reset-password/", {
        email,
        otp,
        new_password: password,
      });
      setMessage(res.data.detail + " Redirecting you to login...");
      setError("");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid verification code or submission keys.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-espresso mb-2 text-center">Account Recovery</h1>
      <p className="text-cocoa/70 mb-8 text-center">
        {!stepTwo ? "Enter your email to receive a 6-digit safety verification code." : "Enter your code and set a new password."}
      </p>

      {/* VIEW STEP 1: ASK FOR EMAIL ADDRESS */}
      {!stepTwo ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Enter account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none"
          />
          {error && <p className="text-blushdark text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? "Sending code..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        /* VIEW STEP 2: SHOW VERIFICATION DROPDOWN WITH OTP AND PASSWORDS */
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {message && <p className="text-gold text-xs bg-gold/10 p-3 rounded-xl border border-gold/20 text-center font-medium">{message}</p>}
          
          <input
            required
            type="text"
            maxLength={6}
            placeholder="Enter 6-Digit OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numbers only rule modification
            className="w-full rounded-xl border border-gold text-center tracking-[0.5em] font-bold text-lg px-4 py-3 bg-white/70 focus:outline-none"
          />

          <input
            required
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none"
          />

          <input
            required
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none"
          />

          {error && <p className="text-blushdark text-sm">{error}</p>}
          
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? "Verifying and updating..." : "Verify & Reset Password"}
          </button>

          <button type="button" onClick={() => setStepTwo(false)} className="text-xs text-cocoa/50 text-center block w-full hover:underline pt-2">
            ← Change Email Address
          </button>
        </form>
      )}
    </div>
  );
}