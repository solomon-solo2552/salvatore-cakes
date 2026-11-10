"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";
import { getImageUrl } from "@/lib/apiUrl";

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || (!user.is_staff && !user.is_superuser))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-amber-100 font-bold">
        <p className="animate-pulse tracking-wide text-lg">⚡ Opening Kitchen Admin Console...</p>
      </div>
    );
  }

  const isActive = (path) => pathname === path;
  // const avatarUrl = user?.profile?.profile_picture;
  const fullAvatarUrl = getImageUrl(user?.profile?.profile_picture);
  return (
    <div className="min-h-screen flex flex-col bg-stone-100 font-sans text-stone-900">
      {/* 👑 DEDICATED ADMIN TOP NAVBAR WITH PROFILE */}
      <header className="bg-stone-900 border-b border-stone-800 text-white px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-amber-400 tracking-tight">
            SALVATORE
          </span>
          <span className="bg-amber-400/20 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-md uppercase border border-amber-400/30">
            Kitchen Admin Suite
          </span>
        </div>

        {/* ADMIN PROFILE SECTION */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-stone-800/90 px-4 py-1.5 rounded-xl border border-stone-700">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-black flex items-center justify-center overflow-hidden text-sm border border-amber-300 shrink-0">
              {fullAvatarUrl ? (
                <img src={fullAvatarUrl} alt="Admin avatar" className="w-full h-full object-cover" />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "👑"
              )}
            </div>
            <div className="text-xs">
              <span className="text-stone-400 block font-bold text-[9px] uppercase leading-tight">Admin Manager</span>
              <strong className="text-white text-xs block font-bold truncate max-w-[120px]">
                {user?.first_name || user?.username}
              </strong>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-xl text-xs font-bold transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* 🏛️ HIGH-CONTRAST BAKER SIDEBAR */}
        <aside className="w-72 bg-stone-900 text-white flex flex-col justify-between p-6 shadow-2xl shrink-0 border-r border-stone-800">
          <nav className="space-y-3 font-semibold text-sm">
            <Link
    href="/admin"
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${
      isActive("/admin")
        ? "bg-amber-400 text-stone-950 font-bold shadow-md"
        : "bg-stone-800/80 text-stone-200 hover:bg-stone-800 hover:text-white"
    }`}
  >
    📊 Sales & Profit Overview
  </Link>
            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${
                isActive("/admin/orders")
                  ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                  : "bg-stone-800/80 text-stone-200 hover:bg-stone-800 hover:text-white"
              }`}
            >
              📦 Live Orders & Tracking
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${
                isActive("/admin/products")
                  ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                  : "bg-stone-800/80 text-stone-200 hover:bg-stone-800 hover:text-white"
              }`}
            >
              🎂 View All Cakes
            </Link>

            <Link
              href="/admin/products/add"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${
                isActive("/admin/products/add")
                  ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                  : "bg-stone-800/80 text-stone-200 hover:bg-stone-800 hover:text-white"
              }`}
            >
              🧁 Add New Cake
            </Link>

            {/* <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-400 hover:text-amber-300 transition pt-6 border-t border-stone-800 text-xs uppercase font-bold tracking-wider"
            >
              🏪 Switch to Customer Shop ↗
            </Link> */}

            <Link
  href="/admin/complaints"
  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
>
  <span className="text-base">💬</span>
  <span>Customer Complaints</span>
</Link>
          </nav>

          <div className="border-t border-stone-800 pt-4 text-xs text-stone-400">
            Active Workspace: <strong className="text-amber-300 block">Kitchen Management</strong>
          </div>
        </aside>

        {/* 📄 MAIN WORKSPACE */}
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}