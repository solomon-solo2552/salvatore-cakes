import api from "@/lib/apiServer";
import AddToCartPanel from "./AddToCartPanel";
import Link from "next/link";
import { getImageUrl } from "@/lib/apiUrl";

async function getProduct(slug) {
  try {
    const res = await api.get(`/products/${slug}/`);
    return res.data;
  } catch (e) {
    return null;
  }
}

// const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "");

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Cake not found</h1>
        <p className="text-cocoa/70">This cake may have sold out permanently or the link is incorrect.</p>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image);
  const reviews = product.reviews || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* TOP GRID: IMAGE & DETAILS */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square rounded-3xl bg-blush/20 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-2xl text-espresso/50 text-center px-8">{product.name}</span>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-blushdark mb-2">
            {product.category?.name}
          </p>
          <h1 className="font-display text-4xl text-espresso mb-3">{product.name}</h1>
          <svg className="swirl-divider" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
              stroke="#C9A15A" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div className="flex items-center gap-3 mb-6 mt-4">
            <span className="text-2xl font-semibold text-espresso">
              ${Number(product.current_price).toFixed(2)}
            </span>
            {product.discount_price && (
              <span className="text-lg text-cocoa/50 line-through">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
            
            {/* OVERALL STAR RATING SUMMARY */}
            {product.average_rating ? (
              <div className="flex items-center gap-1.5 ml-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="text-amber-500 font-bold">★ {product.average_rating}</span>
                <span className="text-xs text-amber-900 font-medium">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            ) : (
              <span className="text-xs text-cocoa/50 ml-2">No ratings yet</span>
            )}
          </div>

          <p className="text-cocoa/80 mb-6">{product.description}</p>

          <ul className="text-sm text-cocoa/70 space-y-1 mb-8">
            <li>Weight: {product.weight_kg} kg</li>
            <li>{product.is_eggless ? "Eggless recipe" : "Contains egg"}</li>
            <li>{product.in_stock ? "In stock, ready to bake" : "Currently out of stock"}</li>
          </ul>

          <AddToCartPanel product={product} />
        </div>
      </div>

      {/* BOTTOM SECTION: FEEDBACK & REVIEWS LIST */}
      <div className="border-t border-espresso/15 pt-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-espresso">Customer Feedback & Reviews ({reviews.length})</h2>
          <Link 
            href="/account/orders" 
            className="text-xs font-bold text-amber-800 hover:underline uppercase tracking-wider"
          >
            Ordered this? Rate it from your account →
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-espresso/10 text-center space-y-2">
            <p className="text-sm text-cocoa/70">No reviews have been written for this product yet.</p>
            <p className="text-xs text-cocoa/50">Purchase and receive your order to leave the first verified rating!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl border border-espresso/15 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 tracking-wider text-sm">
                      {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                    </span>
                    <span className="text-[10px] text-cocoa/40">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  {rev.title && <h3 className="font-bold text-espresso text-sm">{rev.title}</h3>}
                  <p className="text-xs text-cocoa/70 italic">"{rev.comment}"</p>
                </div>
                
                <div className="pt-3 border-t border-espresso/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-espresso/80">— {rev.username}</span>
                  {rev.order_id && <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Verified Order #{rev.order_id}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}