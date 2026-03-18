import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { HomeProduct } from "@/app/types";

interface ProductCardProps {
  product: HomeProduct;
}

const BADGE_STYLES = {
  Sale: "bg-badge-sale text-destructive-foreground",
  New: "bg-badge-new text-accent-foreground",
} as const;

export function ProductCard({ product }: ProductCardProps) {
  const getBadgeClass = (badge?: string) => {
    if (!badge) return "";
    return BADGE_STYLES[badge as keyof typeof BADGE_STYLES] || BADGE_STYLES.New;
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          fill
        />
        {product.badge && (
          <Badge
            className={`absolute left-3 top-3 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getBadgeClass(
              product.badge,
            )}`}
          >
            {product.badge}
          </Badge>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            ₹{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
