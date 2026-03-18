"use client";

import { Category } from "@/app/types";
import { buttonVariants } from "../ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CategoriesProps {
  categories: Category[];
}

const CATEGORY_BUTTON_STYLES = { className: "rounded-sm", size: "sm" as const };

export function Categories({ categories }: CategoriesProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeBadge = searchParams.get("badge");
  const isAllActive = !activeCategory && !activeBadge;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products?page=1"
        replace
        className={buttonVariants({
          ...CATEGORY_BUTTON_STYLES,
          variant: isAllActive ? "default" : "outline",
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
              ...CATEGORY_BUTTON_STYLES,
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
          ...CATEGORY_BUTTON_STYLES,
          variant: activeBadge === "New" ? "default" : "outline",
        })}
      >
        New
      </Link>
      <Link
        href="/products?page=1&badge=Sale"
        replace
        className={buttonVariants({
          ...CATEGORY_BUTTON_STYLES,
          variant: activeBadge === "Sale" ? "default" : "outline",
        })}
      >
        Sale
      </Link>
    </div>
  );
}
