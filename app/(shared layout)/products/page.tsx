import { getCategories } from "@/app/actions";
import Categories from "@/components/web/categories";
import { LoadingComp } from "@/components/web/loading";
import { Products } from "@/components/web/products";
import SortFilter from "@/components/web/sort-filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SearchParamsType {
  page?: string;
  category?: string;
  sort?: string;
  badge?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const page = Number((await searchParams)?.page) || 1;
  const category = (await searchParams)?.category;
  const sort = (await searchParams)?.sort;
  const badge = (await searchParams)?.badge;

  const categoryRes = await getCategories();

  if (!categoryRes || !categoryRes.success) {
    redirect("/");
  }
  const categories = categoryRes.data;

  return (
    <div className="container py-8">
      {/* heading and subheading */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold">Shop</h1>
        {/* <p className="mt-2 text-muted-foreground">{totalPages * 12} products</p> */}
      </div>

      {/* filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* categories */}
        <Categories categories={categories} />
        {/* sort filter */}
        <SortFilter />
      </div>

      {/* products */}
      <Suspense
        key={`${page}-${category}-${sort}-${badge}`}
        fallback={<LoadingComp />}
      >
        <Products page={page} category={category} sort={sort} badge={badge} />
      </Suspense>
    </div>
  );
}
