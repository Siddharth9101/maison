import { Product } from "@/data/product";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          fill
        />
        {product.badge && (
          <Badge
            className={`absolute left-3 top-3 text-[10px] rounded-full font-semibold uppercase tracking-wider ${
              product.badge === "Sale"
                ? "bg-badge-sale text-destructive-foreground"
                : "bg-badge-new text-accent-foreground"
            }`}
          >
            {product.badge}
          </Badge>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
