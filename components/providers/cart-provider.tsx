"use client";

import { CartContext, CartItem } from "@/app/contexts/cart-context";
import { SingleProduct } from "@/app/types";
import { ReactNode, useEffect, useState } from "react";

const isMatchingCartItem = (
  item: CartItem,
  productId: string,
  sku: string,
  size: string,
  color: string,
) =>
  item.product.id === productId &&
  item.sku === sku &&
  item.size === size &&
  item.color === color;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: SingleProduct,
    sku: string,
    size: string,
    color: string,
    quantity = 1,
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) =>
        isMatchingCartItem(item, product.id, sku, size, color),
      );
      if (existing) {
        return prev.map((item) =>
          isMatchingCartItem(item, product.id, sku, size, color)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, sku, quantity, size, color }];
    });
  };

  const removeFromCart = (
    productId: string,
    sku: string,
    size: string,
    color: string,
  ) => {
    setCartItems((prev) =>
      prev.filter((item) => !isMatchingCartItem(item, productId, sku, size, color)),
    );
  };

  const updateQuantity = (
    productId: string,
    sku: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity < 1) return removeFromCart(productId, sku, size, color);
    setCartItems((prev) =>
      prev.map((item) =>
        isMatchingCartItem(item, productId, sku, size, color)
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
