"use client";

import { useCart } from "@/app/contexts/cart-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
        <h1 className="font-display text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/products?page=1"
          className={buttonVariants({ className: "mt-6" })}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <h1 className="mb-8 font-display text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 rounded-lg border bg-card p-4"
            >
              <Link
                href={`/products/${item.product.id}`}
                className="relative size-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary"
              >
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  className="size-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.size} / {item.color}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        removeFromCart(item.product.id, item.size, item.color)
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{total >= 500 ? "Free" : "₹39.99"}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{(total + (total >= 500 ? 0 : 39.99)).toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products?page=1"
            className={buttonVariants({
              variant: "ghost",
              className: "mt-2 w-full",
            })}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
