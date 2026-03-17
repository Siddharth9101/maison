"use client";

import { createContext, useContext } from "react";
import { SingleProduct } from "../types";

export interface CartItem {
  product: SingleProduct;
  sku: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: SingleProduct,
    sku: string,
    size: string,
    color: string,
    quantity?: number,
  ) => void;
  removeFromCart: (
    productId: string,
    sku: string,
    size: string,
    color: string,
  ) => void;
  updateQuantity: (
    productId: string,
    sku: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
