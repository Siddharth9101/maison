"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/web/product-card";
import { products } from "@/data/product";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const categories = [
  "All",
  ...Array.from(new Set(products.map((p) => p.category))),
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory === "new") {
      list = products.filter((p) => p.badge === "New");
    } else if (activeCategory === "sale") {
      list = products.filter((p) => p.badge === "Sale");
    } else if (activeCategory !== "All") {
      list = products.filter((p) => p.category === activeCategory);
    }

    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, sortBy]);

  return (
    <div className="container py-8">
      {/* heading and subheading */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold">Shop</h1>
        <p className="mt-2 text-muted-foreground">{filtered.length} products</p>
      </div>

      {/* filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="rounded-sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* sort filter */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* filtered products */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* no products */}
      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
