import { getProducts } from "@/app/actions";
import { ProductCard } from "./product-card";
import { PaginationComp } from "./pagination";

export async function Products({
  page,
  category,
  sort,
  badge,
}: {
  page: number;
  category?: string;
  sort?: string;
  badge?: string;
}) {
  const productsRes = await getProducts(page, category, sort, badge);
  if (!productsRes || !productsRes.success) {
    console.error("Failed to fetch products");
    return;
  }
  const products = productsRes.data.products;
  const totalPages = productsRes.data.totalPages;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No products found in this category.
        </div>
      )}

      <PaginationComp page={page} totalPages={totalPages} />
    </div>
  );
}
