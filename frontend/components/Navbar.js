"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { CATEGORY_SLUGS } from "@/lib/constants";
import { getImageUrl } from "@/lib/apiUrl";

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, logout } = useAuth();

  // 🚫 DO NOT render customer Navbar when navigating inside any Admin route
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Construct full profile picture URL if set on user profile
  const avatarUrl = getImageUrl(user?.profile?.profile_picture);
  const fullAvatarUrl = avatarUrl 
    ? (avatarUrl.startsWith("http") ? avatarUrl : `http://127.0.0.1:8000${avatarUrl}`) 
    : null;

  return (
    <header className="sticky top-0 z-40 bg-vanilla/90 backdrop-blur border-b border-espresso/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight text-espresso">
          Salvatore <span className="text-blushdark">Cakes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm uppercase tracking-wide text-cocoa">
          <Link href="/shop" className="hover:text-espresso">Shop</Link>
          <Link href={`/shop?category=${CATEGORY_SLUGS.CELEBRATION}`} className="hover:text-espresso">Birthday</Link>
          <Link href={`/shop?category=${CATEGORY_SLUGS.CUSTOM}`} className="hover:text-espresso">Wedding</Link>
          <Link href={`/shop?category=${CATEGORY_SLUGS.CHEESECAKES}`} className="hover:text-espresso">Cheesecakes</Link>
          <Link href="/tasting-box" className="hover:text-amber-800 transition">Tasting Box</Link>
          <Link href="/flavor-finder" className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase px-4 py-2 rounded-full transition">✨ Take Flavor Quiz</Link>
          <Link href="/support" className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-espresso hover:bg-espresso/5 rounded-lg"><span>💬</span><span>Support & Inquiries</span></Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              {(user.is_staff || user.is_superuser) && (
                <>
                  <Link 
                    href="/admin" 
                    className="bg-espresso text-cream hover:bg-espresso/90 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
                  >
                    👑 Kitchen Admin
                  </Link>
                  <span className="text-espresso/20">|</span>
                </>
              )}

              <Link 
                href="/profile" 
                className="relative group flex items-center justify-center w-9 h-9 rounded-full bg-espresso text-cream font-bold overflow-hidden border-2 border-espresso/20 hover:border-blushdark transition shadow-sm"
                title="View Profile"
              >
                {fullAvatarUrl ? (
                  <img 
                    src={fullAvatarUrl} 
                    alt={user.first_name || user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm uppercase">
                    {(user.first_name || user.username || "U").charAt(0)}
                  </span>
                )}
              </Link>

              <span className="text-espresso/20">|</span>
              <button onClick={logout} className="text-blushdark hover:underline">
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline text-sm hover:underline">
              Log in
            </Link>
          )}

          <Link href="/cart" className="relative btn-secondary !px-4 !py-2 text-sm">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-blushdark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}