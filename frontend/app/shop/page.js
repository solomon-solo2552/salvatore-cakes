import api from "@/lib/apiServer";
import ProductCard from "@/components/ProductCard";
import FilterForm from "@/components/FilterForm";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";

async function getProductsData(searchParams) {
  const params = {};
  if (searchParams.category) params.category__slug = searchParams.category;
  if (searchParams.q) params.search = searchParams.q;
  if (searchParams.flavor) params.flavor = searchParams.flavor;
  if (searchParams.ordering) params.ordering = searchParams.ordering;
  if (searchParams.page) params.page = searchParams.page;

  try {
    const res = await api.get("/products/", { params });
    return res.data;
  } catch (e) {
    return { count: 0, next: null, previous: null, results: [] };
  }
}

export default async function ShopPage({ searchParams }) {
  const resolvedParams = (await searchParams) || {};
  const dataPackage = await getProductsData(resolvedParams);

  const products = dataPackage.results || [];
  const currentPage = Number(resolvedParams.page || 1);

  const createPageLink = (pageNumber) => {
    const newParams = new URLSearchParams();
    if (resolvedParams.category) newParams.set("category", resolvedParams.category);
    if (resolvedParams.q) newParams.set("q", resolvedParams.q);
    if (resolvedParams.flavor) newParams.set("flavor", resolvedParams.flavor);
    if (resolvedParams.ordering) newParams.set("ordering", resolvedParams.ordering);
    newParams.set("page", pageNumber);
    return `/shop?${newParams.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-2">The Bakery Case</h1>
      <svg className="swirl-divider" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
          stroke="#C9A15A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* CLIENT FILTER FORM COMPONENT */}
      <FilterForm
        defaultQ={resolvedParams.q}
        defaultFlavor={resolvedParams.flavor}
        category={resolvedParams.category}
      />

      {/* Products Grid */}
      {products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Cakes match your filter"
          description="Try clearing the filters or browsing all cakes."
          actionLabel="Browse all cakes"
          actionHref="/shop"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-espresso/10 pt-8 mt-12">
            {dataPackage.previous ? (
              <Link href={createPageLink(currentPage - 1)} className="btn-secondary !py-2 text-sm">
                ← Previous Page
              </Link>
            ) : (
              <div className="opacity-0 pointer-events-none">Placeholder</div>
            )}

            <span className="text-sm font-medium text-cocoa/70">
              Page {currentPage}
            </span>

            {dataPackage.next ? (
              <Link href={createPageLink(currentPage + 1)} className="btn-primary !py-2 text-sm">
                Next Page →
              </Link>
            ) : (
              <div className="opacity-0 pointer-events-none">Placeholder</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}