"use client";

import {
  createOrder,
  createUserAddress,
  deleteOrder,
  getUserAddressById,
  getVariantBySku,
  verifyPayment,
} from "@/app/actions";
import { useCart } from "@/app/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Maison",
  description: "Complete your purchase and review your order details.",
};

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useUser();
  const [step, setStep] = useState<"address" | "confirmation">("address");
  const router = useRouter();
  const [isPending, setPending] = useState(false);
  const { Razorpay } = useRazorpay();
  const [address, setAddress] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    pin: "",
    country: "",
  });

  useEffect(() => {
    // fetch users address db
    (async () => {
      if (!user?.id) return;
      const res = await getUserAddressById(user.id);

      if (res && res.success && res.data) {
        const addr = res.data;
        setAddress((p) => ({
          ...p,
          phone: addr.phone,
          street: addr.street,
          apt: addr.apt ?? "",
          city: addr.city,
          state: addr.state,
          pin: addr.pin,
          country: addr.country,
        }));
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    (async () => {
      for (const item of cartItems) {
        const res = await getVariantBySku(item.sku);
        if (!res || !res.success) {
          toast.error(
            `Failed to fetch stock for ${item.product.name} ${item.size}/${item.color}`,
            { position: "top-center" },
          );
          router.push("/cart");
          return;
        }
        const variant = res.data;
        if (!variant || variant.stock < item.quantity) {
          toast.error(
            `Only ${variant?.stock ?? 0} are available for ${item.product.name} ${item.size}/${item.color}`,
            { position: "top-center" },
          );
          router.push("/cart");
          return;
        }
      }
    })();
  }, [cartItems, router]);

  if (cartItems.length === 0 && step !== "confirmation") {
    router.push("/cart");
    return;
  }

  const shipping = total >= 500 ? 0 : 39.99;
  const grandTotal = total + shipping;

  const handleAddressSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    if (
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pin
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-center",
      });
      return;
    }
    if (!user?.id) return;
    const addData = {
      phone: address.phone,
      street: address.street,
      apt: address.apt,
      city: address.city,
      state: address.state,
      pin: address.pin,
      country: address.country,
    };
    const res = await createUserAddress(user?.id, addData);
    if (!res || !res.success) {
      toast.error("Failed to save address. Please try again.", {
        position: "top-center",
      });
      return;
    }
    handlePayment();
    setPending(false);
  };

  const handlePayment = async () => {
    const orderRes = await createOrder(cartItems);

    if (!orderRes || !orderRes.success) {
      toast.error("Failed to create order. Please try again.", {
        position: "top-center",
      });
      return;
    }

    const { order } = orderRes.data;
    const options: RazorpayOrderOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: "INR",
      name: "Maison",
      description: "Thank you for your purchase!",
      order_id: order.id,

      handler: async (response) => {
        // send to backend for verification
        const res = await verifyPayment(response, cartItems);

        if (!res || !res.success) {
          toast.error("Failed to verify payment. Please try again.", {
            position: "top-center",
          });
          return;
        }

        setStep("confirmation");
        clearCart();
      },

      prefill: {
        name: "Siddharth Saxena",
        email: "siddharthsaxena9101@gmail.com",
      },

      theme: {
        color: "#000000",
      },
    };
    const paymentObject = new Razorpay(options);

    paymentObject.on("payment.failed", async (response) => {
      console.log("Payment failed:", response.error);

      await deleteOrder(order.id);

      toast.error("Payment failed. Please try again.", {
        position: "top-center",
      });
    });
    paymentObject.open();
  };

  //   step confirmation
  if (step === "confirmation") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent/20">
          <Check className="size-8 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase.
          {/* TODO: Email service -  You'll receive a confirmation email
          shortly. */}
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }
  return (
    <div className="container py-8">
      {/*  go back button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() =>
          step === "address" ? router.push("/cart") : setStep("address")
        }
      >
        <ArrowLeft className="h-4 w-4" />{" "}
        {step === "address" ? "Back to Cart" : "Back to Address"}
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* step address */}
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">
                Shipping Address
              </h2>
              <p className="text-sm text-muted-foreground font-bold">
                All fields marked with * are required.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={address.firstName}
                    disabled={!!user?.firstName}
                    onChange={(e) =>
                      setAddress({ ...address, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    disabled={!!user?.lastName}
                    value={address.lastName}
                    onChange={(e) =>
                      setAddress({ ...address, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled={!!user?.emailAddresses[0]?.emailAddress}
                    value={address.email}
                    onChange={(e) =>
                      setAddress({ ...address, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apt">Apt / Suite</Label>
                <Input
                  id="apt"
                  value={address.apt}
                  onChange={(e) =>
                    setAddress({ ...address, apt: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin">Pin Code *</Label>
                  <Input
                    id="pin"
                    value={address.pin}
                    onChange={(e) =>
                      setAddress({ ...address, pin: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* order summary sidebar */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-3"
              >
                <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-secondary">
                  <Image
                    src={item.product.thumbnail}
                    alt=""
                    fill
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} / {item.color} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
