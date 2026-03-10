"use client";

import { useCart } from "@/app/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { products } from "@/data/product";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const router = useRouter();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

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
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to cart`);
  };

  //   product found
  return (
    <div className="container py-8">
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
              src={product.images[activeImage]}
              alt={product.name}
              className="size-full object-cover"
              fill
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
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
              {product.category}
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
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* colors */}
          <div>
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
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
              ))}
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
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                handleAddToCart();
                router.push("/cart");
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
