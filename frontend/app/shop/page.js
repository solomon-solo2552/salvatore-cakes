import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

async function getProducts(searchParams) {
  const params = {};
  if (searchParams.category) params.category__slug = searchParams.category;
  if (searchParams.q) params.search = searchParams.q;
  if (searchParams.flavor) params.flavor = searchParams.flavor;
  if (searchParams.ordering) params.ordering = searchParams.ordering;

  try {
    const res = await api.get("/products/", { params });
    return res.data.results || res.data;
  } catch (e) {
    return [];
  }
}

export default async function ShopPage({ searchParams }) {
  const products = await getProducts(searchParams || {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-2">The Bakery Case</h1>
      <svg className="swirl-divider" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
          stroke="#C9A15A" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <form className="flex flex-wrap gap-3 mb-10" action="/shop">
        <input
          type="text"
          name="q"
          defaultValue={searchParams?.q || ""}
          placeholder="Search cakes..."
          className="rounded-full border border-espresso/20 px-4 py-2 text-sm flex-1 min-w-[200px] bg-white/70"
        />
        <select
          name="flavor"
          defaultValue={searchParams?.flavor || ""}
          className="rounded-full border border-espresso/20 px-4 py-2 text-sm bg-white/70"
        >
          <option value="">All flavors</option>
          <option value="chocolate">Chocolate</option>
          <option value="vanilla">Vanilla</option>
          <option value="red_velvet">Red Velvet</option>
          <option value="fruit">Fruit</option>
          <option value="cheesecake">Cheesecake</option>
        </select>
        <button type="submit" className="btn-secondary !py-2 text-sm">Filter</button>
      </form>

      {products.length === 0 ? (
        <p className="text-cocoa/60">
          No cakes match yet. Try clearing filters, or seed the backend with sample products.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
