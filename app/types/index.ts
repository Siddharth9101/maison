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
