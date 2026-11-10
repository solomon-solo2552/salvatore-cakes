"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    delivery_date: "",
    payment_method: "upi",
    notes: "",
  });

  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 💳 Interactive Gateway Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // "form" | "processing" | "success"
  const [upiTab, setUpiTab] = useState("id"); // "id" | "qr"
  const [cardData, setCardData] = useState({ number: "", holder: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const autoFillProfileData = async () => {
      try {
        const res = await api.get("/accounts/profile/");
        const data = res.data;
        const profile = data?.profile || {};

        const constructedName = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ");

        setForm((prevForm) => ({
          ...prevForm,
          full_name: constructedName || data.username || "",
          phone: profile.phone || "",
          address_line: profile.address_line || "",
          city: profile.city || "",
          postal_code: profile.postal_code || "",
          country: profile.country || "",
        }));
      } catch (err) {
        console.error("Failed to auto-fill profile details on checkout:", err);
      } finally {
        setFetchingProfile(false);
      }
    };

    if (user) {
      autoFillProfileData();
    } else {
      setFetchingProfile(false);
    }
  }, [user, authLoading]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Core API Order Dispatcher
  const executeOrderCreation = async () => {
    const formattedItems = items.map((i) => {
      const isNumericId = i.id !== null && i.id !== undefined && !isNaN(Number(i.id));

      return {
        product_id: isNumericId ? String(i.id) : null,
        product_name: i.name || "Bakery Item",
        price: Number(i.price || 0).toFixed(2),
        quantity: Number(i.quantity || 1),
        details: i.details || "",
      };
    });

    const payload = {
      ...form,
      delivery_date: form.delivery_date ? form.delivery_date : null,
      items: formattedItems,
    };

    const res = await api.post("/orders/", payload);
    clearCart();
    return res.data;
  };

  // Main Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // If Cash on Delivery, place directly
    if (form.payment_method === "cod") {
      setSubmitting(true);
      try {
        const orderData = await executeOrderCreation();
        toast.success("Order placed!", {
          description: `Order #${orderData.id} confirmed - we'll start baking soon.`,
          duration: 4000,
        });
        router.push(`/account/orders?placed=${orderData.id}`);
      } catch (err) {
        console.error("Order submit error:", err.response?.data);
        const rawError = err.response?.data;
        const message =
          typeof rawError === "object"
            ? JSON.stringify(rawError)
            : rawError || "Something went wrong placing your order.";
        setError(message);
        toast.error("Order failed", { description: message, duration: 6000 });
      } finally {
        setSubmitting(false);
      }
    } else {
      // For Card / UPI, open the On-The-Spot Payment Gateway
      setPaymentStep("form");
      setShowPaymentModal(true);
    }
  };

  // Simulates bank/UPI gateway authorization and finalizes order
  const handleGatewayPayment = async (e) => {
    e.preventDefault();
    setPaymentStep("processing");

    try {
      // Simulate real-time 1.8s bank network transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const orderData = await executeOrderCreation();
      setPaymentStep("success");

      setTimeout(() => {
        setShowPaymentModal(false);
        router.push(`/account/orders?placed=${orderData.id}`);
      }, 1200);
    } catch (err) {
      setPaymentStep("form");
      console.error("Payment error:", err);
      const rawError = err.response?.data;
      toast.error("Payment authorization failed", {
        description:
          typeof rawError === "object"
            ? JSON.stringify(rawError)
            : rawError || err.message,
        duration: 6000,
      });
    }
  };

  if (authLoading || fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/20">
        <p className="text-cocoa/60 animate-pulse text-sm font-semibold">Gathering your delivery details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4 font-bold">Log in to check out</h1>
        <p className="text-cocoa/70 mb-8 font-medium">
          Create an account or log in so we can save your order and delivery details.
        </p>
        <a href="/login" className="btn-primary">Log in</a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4 font-bold">Your cart is empty</h1>
        <a href="/shop" className="btn-primary">Browse the bakery</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-8 font-black">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Full Name</label>
          <input required name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Phone Number</label>
          <input required name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Delivery Address</label>
          <input required name="address_line" placeholder="Delivery address" value={form.address_line} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">City</label>
          <input required name="city" placeholder="City" value={form.city} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Postal Code</label>
          <input required name="postal_code" placeholder="Postal code" value={form.postal_code} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Country</label>
          <input required name="country" placeholder="Country" value={form.country} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Target Delivery Date (Optional)</label>
          <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none font-medium" />
        </div>

        {/* 💳 PAYMENT METHOD SELECTION */}
        <div className="sm:col-span-2 space-y-2 mt-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "upi", label: "📱 Instant UPI" },
              { id: "card", label: "💳 Debit / Credit Card" },
              { id: "cod", label: "💵 Cash on Delivery" },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setForm({ ...form, payment_method: method.id })}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  form.payment_method === method.id
                    ? "border-amber-700 bg-amber-700 text-white shadow-sm scale-[1.02]"
                    : "border-espresso/20 bg-white/70 text-espresso hover:bg-white"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 mt-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-cocoa/50 block mb-1">Special Instructions</label>
          <textarea name="notes" placeholder="Special instructions (cake message, allergies, etc.)"
            value={form.notes} onChange={handleChange} rows={3}
            className="w-full rounded-xl border border-espresso/20 px-4 py-3 bg-white/70 text-sm focus:outline-none font-medium" />
        </div>

        {/* {error && (
          <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl break-words">
            ⚠️ Order error details: {error}
          </div>
        )} */}

        {/* Errors now shown as toast notifications */}

        <div className="sm:col-span-2 flex items-center justify-between border-t border-espresso/10 pt-6 mt-2">
          <span className="font-display text-2xl text-espresso font-bold">Total: ${total.toFixed(2)}</span>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50 font-bold px-8 py-3.5 rounded-full shadow-lg">
            {submitting ? "Placing order..." : form.payment_method === "cod" ? "Place Order (COD)" : "Proceed to Payment →"}
          </button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 🔐 SALVATORE ON-THE-SPOT PAYMENT GATEWAY MODAL */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-espresso/20 space-y-6 relative">
            
            {/* CLOSE BUTTON */}
            {paymentStep === "form" && (
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-5 right-5 text-espresso/50 hover:text-espresso text-lg font-black"
              >
                ✕
              </button>
            )}

            {/* HEADER */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">
                Salvatore Encrypted Gateway
              </span>
              <h3 className="font-display text-2xl font-black text-espresso">
                {form.payment_method === "card" ? "Pay with Card" : "Instant UPI Checkout"}
              </h3>
              <p className="text-xs font-bold text-stone-500">
                Amount payable: <span className="text-emerald-700 font-black text-sm">${total.toFixed(2)}</span>
              </p>
            </div>

            {/* ==================== 1. PROCESSING STATE ==================== */}
            {paymentStep === "processing" && (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="font-display text-lg font-bold text-espresso">Authorizing Transaction...</h4>
                <p className="text-xs text-stone-500 font-medium">Please do not close or refresh this window.</p>
              </div>
            )}

            {/* ==================== 2. SUCCESS STATE ==================== */}
            {paymentStep === "success" && (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto border-2 border-emerald-300">
                  ✓
                </div>
                <h4 className="font-display text-xl font-black text-emerald-800">Payment Approved!</h4>
                <p className="text-xs text-stone-500 font-medium">Redirecting to your order confirmation...</p>
              </div>
            )}

            {/* ==================== 3. CARD PAYMENT FORM ==================== */}
            {paymentStep === "form" && form.payment_method === "card" && (
              <form onSubmit={handleGatewayPayment} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    placeholder="4532 •••• •••• 8892"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Damon Salvatore"
                    value={cardData.holder}
                    onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      maxLength="5"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer"
                >
                  Authorize & Pay ${total.toFixed(2)} 🔒
                </button>
              </form>
            )}

            {/* ==================== 4. INSTANT UPI PAYMENT FORM ==================== */}
            {paymentStep === "form" && form.payment_method === "upi" && (
              <div className="space-y-5">
                {/* TABS: UPI ID vs DYNAMIC QR CODE */}
                <div className="flex border-b border-stone-200 text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setUpiTab("id")}
                    className={`flex-1 pb-2.5 uppercase tracking-wider transition ${
                      upiTab === "id" ? "border-b-2 border-amber-700 text-amber-900" : "text-stone-400"
                    }`}
                  >
                    Enter UPI ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiTab("qr")}
                    className={`flex-1 pb-2.5 uppercase tracking-wider transition ${
                      upiTab === "qr" ? "border-b-2 border-amber-700 text-amber-900" : "text-stone-400"
                    }`}
                  >
                    Scan Instant QR
                  </button>
                </div>

                {upiTab === "id" ? (
                  <form onSubmit={handleGatewayPayment} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                        Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="yourname@okhdfcbank / mobile@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500">
                      <span>Supported:</span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded">GPay</span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded">PhonePe</span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded">Paytm</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer"
                    >
                      Verify & Pay ${total.toFixed(2)} 📱
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 bg-stone-50 border-2 border-dashed border-amber-400 rounded-2xl mx-auto flex flex-col items-center justify-center p-3">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=salvatorecakes@upi%26pn=SalvatoreCakes%26am=${total.toFixed(2)}%26cu=INR`}
                        alt="Salvatore UPI QR"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-xs font-semibold text-stone-600">
                      Scan with Google Pay, PhonePe, or Paytm app.
                    </p>
                    <button
                      type="button"
                      onClick={handleGatewayPayment}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition cursor-pointer"
                    >
                      Simulate App Payment Completed ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SECURITY FOOTNOTE */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-wider pt-2 border-t border-stone-100">
              <span>🔒 256-Bit SSL End-to-End Encryption</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}