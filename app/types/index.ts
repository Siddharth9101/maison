export interface Product {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: "Sale" | "New";
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type HomeProduct = Pick<
  Product,
  "id" | "name" | "price" | "badge" | "thumbnail"
> & { category: { name: string } };

export type ActionResponse<T> =
  | {
      success: true;
      message: string;
      data: T;
      status: number;
    }
  | {
      success: false;
      error: string;
      status: number;
    };

export interface SingleProduct {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice: number | undefined;
  rating: number;
  badge?: "Sale" | "New";
  reviews: number;
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    images: string[];
    stock: number;
  }[];
  category: {
    id: string;
    name: string;
  };
}

export interface Address {
  id: string;
  phone: string;
  street: string;
  apt: string | null;
  city: string;
  state: string;
  pin: string;
  country: string;
  userId: string;
}

export interface Order {
  orderId: string;
  userId: string;
  items: {
    sku: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
  }[];
  total: number;
  status: "Pending" | "Paid";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}
