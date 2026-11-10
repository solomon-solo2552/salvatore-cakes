import Link from "next/link";
import { CATEGORY_SLUGS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-espresso text-vanilla mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl mb-2">Salvatore Cakes</h3>
          <p className="text-sm text-vanilla/70">
            Handcrafted cakes, baked fresh daily and delivered with care.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-wide text-gold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-vanilla/80">
            <li><Link href="/shop" className="hover:underline">All Cakes</Link></li>
            <li><Link href={`/shop?category=${CATEGORY_SLUGS.CUPCAKES}`} className="hover:underline">Cupcakes</Link></li>
            <li><Link href={`/shop?category=${CATEGORY_SLUGS.EGGLESS}`} className="hover:underline">Eggless</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-wide text-gold mb-3">Contact</h4>
          <p className="text-sm text-vanilla/80">hello@salvatorecakes.com</p>
          <p className="text-sm text-vanilla/80">+1 (555) 010-0143</p>
        </div>
      </div>
      <div className="text-center text-xs text-vanilla/50 pb-6">
        © {new Date().getFullYear()} Salvatore Cakes. All rights reserved.
      </div>
    </footer>
  );
}