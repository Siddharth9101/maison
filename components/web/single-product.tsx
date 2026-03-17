"use client";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/app/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SingleProduct } from "@/app/types";

export function SingleProductComp({ product }: { product: SingleProduct }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const images = selectedVariant?.images.length
    ? selectedVariant.images
    : [product.thumbnail, ...product.variants.flatMap((v) => v.images)];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = selectedSize
    ? [
        ...new Set(
          product.variants
            .filter((v) => v.size === selectedSize)
            .map((v) => v.color),
        ),
      ]
    : [];

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    if (
      !product.variants.some(
        (v) => v.size === size && v.color === selectedColor,
      )
    ) {
      setSelectedColor(undefined);
    }
  };

  //   if not product found
  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Back to Shop
        </Button>
      </div>
    );
  }

  //   add to cart handler
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size", { position: "top-center" });
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color", { position: "top-center" });
      return;
    }

    if (!selectedVariant) {
      toast.error("Product not available with this size and color", {
        position: "top-center",
      });
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error(
        selectedVariant.stock === 0
          ? "Out of stock"
          : `Only ${selectedVariant.stock} available in stock`,
        { position: "top-center" },
      );
      return;
    }

    addToCart(
      product,
      selectedVariant.sku,
      selectedSize,
      selectedColor,
      quantity,
    );
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };
  return (
    <>
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
            <Image
              src={images[activeImage]}
              alt={product.name}
              className="size-full object-cover"
              fill
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative size-20 overflow-hidden rounded-md border-2 transition-colors ${
                    i === activeImage ? "border-accent" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    className="size-full object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* details */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {product.category.name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* size */}
          <div>
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* colors */}
          <div>
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors &&
                colors.length > 0 &&
                colors.map((color) => {
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background hover:border-foreground/30"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* quantity */}
          <div>
            <p className="mb-2 text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* add to cart */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
