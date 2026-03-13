"use client";

import { Category } from "@/app/types";
import { buttonVariants } from "../ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeBadge = searchParams.get("badge");
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products?page=1"
        replace
        className={buttonVariants({
          className: "rounded-sm",
          size: "sm",
          variant:
            activeCategory === null && activeBadge === null
              ? "default"
              : "outline",
        })}
      >
        All
      </Link>
      {categories.map((cat) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        params.set("category", cat.name);

        return (
          <Link
            key={cat.id}
            href={`/products?${params.toString()}`}
            replace
            className={buttonVariants({
              className: "rounded-sm",
              size: "sm",
              variant: activeCategory === cat.name ? "default" : "outline",
            })}
          >
            {cat.name}
          </Link>
        );
      })}
      <Link
        href="/products?page=1&badge=New"
        replace
        className={buttonVariants({
          className: "rounded-sm",
          size: "sm",
          variant: activeBadge === "New" ? "default" : "outline",
        })}
      >
        New
      </Link>
      <Link
        href="/products?page=1&badge=Sale"
        replace
        className={buttonVariants({
          className: "rounded-sm",
          size: "sm",
          variant: activeBadge === "Sale" ? "default" : "outline",
        })}
      >
        Sale
      </Link>
    </div>
  );
}
