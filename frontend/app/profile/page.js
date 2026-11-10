"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/apiUrl";
import { toast } from "sonner";
import { OrderRowSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✏️ EDIT PROFILE FORM STATE
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const PROGRESS_STAGES = [
    "pending",
    "confirmed",
    "baking",
    "finished",
    "packed",
    "out_for_delivery",
    "delivered",
    "received",
  ];

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        api.get("/accounts/profile/"),
        api.get("/orders/"),
      ]);

      setProfileData(profileRes.data);
      setOrders(ordersRes.data.results || ordersRes.data || []);

      if (profileRes.data) {
        const d = profileRes.data.profile || {};
        setFormData({
          first_name: profileRes.data.first_name || "",
          last_name: profileRes.data.last_name || "",
          phone: d.phone || "",
          address_line: d.address_line || "",
          city: d.city || "",
          postal_code: d.postal_code || "",
          country: d.country || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile data or orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [user, authLoading, router]);

  // 💾 SAVE EDITED PROFILE HANDLER
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await api.patch("/accounts/profile/", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
          phone: formData.phone,
          address_line: formData.address_line,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
        },
      });

      setProfileData(res.data);
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    try {
      await api.patch(`/orders/${orderId}/`, { status: "cancelled" });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success(`Order #${orderId} cancelled`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to cancel order.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm(`Are you sure you want to delete Order #${orderId}?`)) return;

    try {
      await api.delete(`/orders/${orderId}/`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(`Order #${orderId} deleted`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete order.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("profile_picture", file);

    try {
      const res = await api.patch("/accounts/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileData(res.data);
      toast.success("Profile picture updated");
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "baking":
        return "bg-orange-100 text-orange-800 border-orange-200 font-bold";
      case "finished":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "packed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "out_for_delivery":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "delivered":
      case "received":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-espresso/10 text-espresso border-espresso/20";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 bg-cream/10 min-h-screen">
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-espresso/10 pb-8 mb-10">
          <div className="w-24 h-24 rounded-full bg-espresso/10 animate-pulse" />
          <div className="flex-grow space-y-3 w-full">
            <div className="h-8 w-64 bg-espresso/10 rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-4 w-40 bg-espresso/10 rounded animate-pulse mx-auto md:mx-0" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/60 border border-espresso/10 rounded-2xl p-6 space-y-4">
            <div className="h-6 w-32 bg-espresso/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-espresso/10 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-espresso/10 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-espresso/10 rounded animate-pulse" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-56 bg-espresso/10 rounded animate-pulse" />
            {Array.from({ length: 2 }).map((_, i) => (
              <OrderRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const details = profileData?.profile || {};
  // const avatarUrl = details.profile_picture || profileData?.profile_picture;
  const fullAvatarUrl = getImageUrl(details.profile_picture || profileData?.profile_picture);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-cream/10 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-espresso/10 pb-8 mb-10">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-espresso/5 border-2 border-espresso/10 flex items-center justify-center text-4xl shadow-sm">
            {fullAvatarUrl ? (
              <img
                src={fullAvatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              "🍰"
            )}
          </div>

          <label className="text-[11px] font-medium text-cocoa/70 cursor-pointer hover:underline">
            {uploading ? "Uploading..." : "📷 Upload Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center md:text-left flex-grow">
          <h1 className="font-display text-3xl text-espresso">
            Hello, {profileData?.first_name || profileData?.username || "Baker"}!
          </h1>
          <p className="text-cocoa/60 text-sm mt-1">
            Member since {profileData?.date_joined ? new Date(profileData.date_joined).toLocaleDateString() : "recently"}
          </p>
        </div>

        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="border border-blushdark/40 text-blushdark text-xs px-4 py-2 rounded-xl hover:bg-blushdark/5 transition font-medium"
        >
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ACCOUNT DETAILS PANEL WITH EDIT OPTION */}
        <div className="md:col-span-1 bg-white/60 backdrop-blur-sm border border-espresso/10 rounded-2xl p-6 h-fit space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-espresso/5 pb-2">
            <h2 className="font-display text-xl text-espresso">Account Info</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-blushdark hover:underline"
              >
                ✏️ Edit Details
              </button>
            )}
          </div>

          {isEditing ? (
            /* 📝 EDIT FORM MODE */
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-cocoa/60 font-bold uppercase text-[9px]">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                />
              </div>

              <div>
                <label className="block text-cocoa/60 font-bold uppercase text-[9px]">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                />
              </div>

              <div>
                <label className="block text-cocoa/60 font-bold uppercase text-[9px]">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                />
              </div>

              <div>
                <label className="block text-cocoa/60 font-bold uppercase text-[9px]">Address Line</label>
                <input
                  type="text"
                  value={formData.address_line}
                  onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                  placeholder="Street address & unit"
                  className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-cocoa/60 font-bold uppercase text-[9px]">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                  />
                </div>
                <div>
                  <label className="block text-cocoa/60 font-bold uppercase text-[9px]">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cocoa/60 font-bold uppercase text-[9px]">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-espresso/20 bg-white focus:outline-none focus:border-espresso font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2 bg-espresso text-cream font-bold rounded-xl hover:bg-espresso/90 transition text-xs"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full py-2 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300 transition text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* 👁️ DISPLAY READ-ONLY MODE */
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa/40 block">Username</span>
                <span className="text-sm text-espresso font-medium">{profileData?.username}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa/40 block">Email Address</span>
                <span className="text-sm text-espresso font-medium truncate block">{profileData?.email}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa/40 block">Full Name</span>
                <span className="text-sm text-espresso font-medium">
                  {profileData?.first_name || profileData?.last_name
                    ? `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim()
                    : "Not specified"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa/40 block">Contact Phone</span>
                <span className="text-sm text-espresso font-medium">{details.phone || "Not provided"}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa/40 block">Delivery Address</span>
                <p className="text-sm text-espresso font-medium leading-relaxed">
                  {details.address_line ? (
                    <>
                      {details.address_line}<br />
                      {details.city}, {details.postal_code}<br />
                      {details.country}
                    </>
                  ) : (
                    "No delivery address saved."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ORDER HISTORY PANEL */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-display text-2xl text-espresso mb-4">Order History & Live Tracker</h2>

          {orders.length === 0 ? (
            <EmptyState
              icon="🧁"
              title="No cake orders placed yet"
              description="When you order custom celebration tiers or loaf slices, your tracking details will display right here!"
              actionLabel="Browse Bakery Menu"
              actionHref="/shop"
            />
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStageIndex = PROGRESS_STAGES.indexOf(order.status);
                const isCancelled = order.status === "cancelled";

                return (
                  <div key={order.id} className="bg-white/60 border border-espresso/10 rounded-2xl p-5 shadow-sm space-y-4">
                    {/* Order Header & Status Badge */}
                    <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                      <span className="font-display text-lg text-espresso">Order #{order.id}</span>
                      <span
                        className={`text-xs uppercase font-bold tracking-wide px-3 py-1 rounded-full border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status?.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* LIVE TRACKING TIMELINE BAR */}
                    {isCancelled ? (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold text-center">
                        🚫 Order Cancelled
                      </div>
                    ) : (
                      <div className="space-y-2 bg-espresso/5 p-3.5 rounded-xl border border-espresso/5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cocoa/60 block">
                          Live Bakery Dispatch Tracker
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
                          {PROGRESS_STAGES.map((stageKey, idx) => {
                            const isCompleted = idx <= currentStageIndex;
                            const isCurrent = idx === currentStageIndex;

                            return (
                              <div key={stageKey} className="flex flex-col items-center gap-1 text-center">
                                <div
                                  className={`w-full h-2 rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-espresso/10"
                                    } ${isCurrent ? "ring-2 ring-emerald-600 ring-offset-1" : ""}`}
                                />
                                <span
                                  className={`text-[8px] uppercase font-bold leading-tight ${isCurrent ? "text-emerald-900 font-black" : "text-cocoa/40"
                                    }`}
                                >
                                  {stageKey.replace(/_/g, " ")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Arrival Date, Payment Method & Placed Date */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-espresso/5 p-3 rounded-xl">
                      <div>
                        <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Arrival Date</span>
                        <span className="font-medium text-espresso">
                          {order.delivery_date
                            ? new Date(order.delivery_date).toLocaleDateString()
                            : "Standard Delivery"}
                        </span>
                      </div>
                      <div>
                        <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Payment Method</span>
                        <span className="font-medium text-espresso uppercase">
                          {order.payment_method || "COD"}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Placed On</span>
                        <span className="font-medium text-espresso">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Itemized Breakdown */}
                    <ul className="text-sm text-cocoa/70 space-y-1">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex justify-between border-b border-dashed border-espresso/10 pb-1">
                          <span>
                            {item.product_name || item.product?.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-espresso">
                            ${Number(item.subtotal || item.unit_price * item.quantity || 0).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Total & Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-2 border-t border-espresso/10 gap-3">
                      <span className="font-display text-lg text-espresso font-bold">
                        Total: ${Number(order.total_amount || order.total || 0).toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Cancel Button */}
                        {["pending", "confirmed"].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition font-medium"
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-espresso/20 text-cocoa hover:bg-espresso/5 transition font-medium"
                        >
                          Delete Record
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}