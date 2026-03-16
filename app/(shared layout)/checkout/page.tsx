"use client";

import { useCart } from "@/app/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const [step, setStep] = useState<"address" | "payment" | "confirmation">(
    "address",
  );
  const router = useRouter();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    pin: "",
    country: "",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    for (const item of cartItems) {
      const variant = item.product.variants.find(
        (v) => v.size === item.size && v.color === item.color,
      );
      if (!variant || variant.stock < item.quantity) {
        toast.error(
          `Only ${variant?.stock ?? 0} are available for ${item.product.name} ${item.size}/${item.color}`,
          { position: "top-center" },
        );
        router.push("/cart");
        return;
      }
    }
  }, [cartItems, router]);

  if (cartItems.length === 0 && step !== "confirmation") {
    router.push("/cart");
    return null;
  }

  const shipping = total >= 500 ? 0 : 39.99;
  const grandTotal = total + shipping;

  const handleAddressSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (
      !address.firstName ||
      !address.lastName ||
      !address.email ||
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
    setStep("payment");
  };
  const handlePaymentSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (
      !payment.cardNumber ||
      !payment.cardName ||
      !payment.expiry ||
      !payment.cvv
    ) {
      toast.error("Please fill in all payment fields", {
        position: "top-center",
      });
      return;
    }
    clearCart();
    setStep("confirmation");
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
          Thank you for your purchase. You'll receive a confirmation email
          shortly.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Order #MAI-abfiuwgrffafs
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }
  return (
    <div className="container py-8">
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
          {/* Steps indicator */}
          <div className="mb-8 flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${step === "address" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${step === "address" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
              >
                1
              </span>
              <span className="text-sm font-medium">Address</span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div
              className={`flex items-center gap-2 ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </span>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>

          {/* step address */}
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={address.firstName}
                    onChange={(e) =>
                      setAddress({ ...address, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
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
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Continue to Payment
              </Button>
            </form>
          )}

          {/* step payment */}
          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">
                Payment Details
              </h2>
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input
                  id="cardName"
                  value={payment.cardName}
                  onChange={(e) =>
                    setPayment({ ...payment, cardName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={payment.cardNumber}
                  onChange={(e) =>
                    setPayment({ ...payment, cardNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) =>
                      setPayment({ ...payment, expiry: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={payment.cvv}
                    onChange={(e) =>
                      setPayment({ ...payment, cvv: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 sm:w-auto"
              >
                <CreditCard className="size-4" /> Place Order — $
                {grandTotal.toFixed(2)}
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
