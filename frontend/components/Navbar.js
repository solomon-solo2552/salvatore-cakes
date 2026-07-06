"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-vanilla/90 backdrop-blur border-b border-espresso/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight text-espresso">
          Salvatore <span className="text-blushdark">Cakes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm uppercase tracking-wide text-cocoa">
          <Link href="/shop" className="hover:text-espresso">Shop</Link>
          <Link href="/shop?category=birthday-cakes" className="hover:text-espresso">Birthday</Link>
          <Link href="/shop?category=wedding-cakes" className="hover:text-espresso">Wedding</Link>
          <Link href="/shop?category=cheesecakes" className="hover:text-espresso">Cheesecakes</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <Link href="/account/orders" className="hover:underline">
                Hi, {user.first_name || user.username}
              </Link>
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
