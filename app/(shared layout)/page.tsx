import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/web/product-card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getHomeProducts } from "../actions";
import { toast } from "sonner";

export default async function HomePage() {
  const categoriesRes = await getCategories();

  if (!categoriesRes || !categoriesRes.success) {
    toast.error("Failed to fetch categories", { position: "top-center" });
    return;
  }
  const categories = categoriesRes.data;

  const products = await getHomeProducts();
  if (!products || !products.success) {
    toast.error("Failed to fetch products", { position: "top-center" });
    return;
  }
  const { featured, newArrivals } = products.data;

  return (
    <div className="min-h-screen">
      {/* hero section */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-secondary/50">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Hero Image"
            fill
            className="size-full object-cover opacity-30 dark:opacity-20"
          />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Spring/Summer {new Date().getFullYear()}
            </p>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Timeless
              <br />
              Essentials
            </h1>
            <p className="text-lg text-muted-foreground">
              Thoughtfully designed pieces that transcend seasons. Crafted for
              comfort, built to last.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products?page=1"
                className={buttonVariants({ size: "lg" })}
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href="/products?category=new"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* categories */}
      <section className="container py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?page=1&category=${cat.name}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/30 transition-colors group-hover:bg-foreground/40" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-xl font-semibold text-primary-foreground">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="container pb-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Featured</h2>
          <Link
            href="/products"
            className="text-sm flex gap-2  items-center font-medium text-muted-foreground hover:text-foreground"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* banner */}
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container space-y-4">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Free Shipping on Orders Over ₹500
          </h2>
          <p className="text-primary-foreground/70">
            Plus easy 30-day returns on all orders.
          </p>
          <Link
            href="/products?page=1"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-primary-foreground/30 text-primary hover:text-primary-foreground dark:text-primary-foreground hover:bg-primary-foreground/10",
            })}
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* new arrivals */}
      {newArrivals.length > 0 && (
        <section className="container py-16">
          <h2 className="mb-8 font-display text-3xl font-bold">New Arrivals</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
