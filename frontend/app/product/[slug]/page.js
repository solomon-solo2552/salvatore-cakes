import api from "@/lib/api";
import AddToCartPanel from "./AddToCartPanel";

async function getProduct(slug) {
  try {
    const res = await api.get(`/products/${slug}/`);
    return res.data;
  } catch (e) {
    return null;
  }
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "");

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Cake not found</h1>
        <p className="text-cocoa/70">This cake may have sold out permanently or the link is incorrect.</p>
      </div>
    );
  }

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${API_BASE}${product.image}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
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

        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-semibold text-espresso">
            ${Number(product.current_price).toFixed(2)}
          </span>
          {product.discount_price && (
            <span className="text-lg text-cocoa/50 line-through">
              ${Number(product.price).toFixed(2)}
            </span>
          )}
          {product.average_rating && (
            <span className="text-sm text-cocoa/70">★ {product.average_rating}</span>
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
  );
}
