export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  badge?: "Sale" | "New";
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wool Blend Overcoat",
    price: 289,
    description:
      "A timeless overcoat crafted from premium wool blend fabric. Features a clean silhouette with notch lapels, two-button closure, and welt pockets. Perfect for layering during cooler months.",
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Camel", "Navy"],
    badge: "New",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Cashmere Crewneck Sweater",
    price: 159,
    originalPrice: 219,
    description:
      "Luxuriously soft cashmere sweater with a relaxed fit. Ribbed cuffs and hem provide structure while maintaining comfort. A wardrobe essential for every season.",
    category: "Knitwear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "Heather Grey", "Black"],
    badge: "Sale",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "3",
    name: "Slim Fit Chinos",
    price: 89,
    description:
      "Tailored chinos in a modern slim fit. Made from stretch cotton twill for all-day comfort. Features a mid-rise waist and tapered leg.",
    category: "Pants",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Tan", "Olive", "Navy", "Black"],
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "4",
    name: "Linen Button-Down Shirt",
    price: 98,
    description:
      "Breathable linen shirt with a relaxed button-down collar. Garment-washed for a soft, lived-in feel. Perfect for warm-weather styling.",
    category: "Shirts",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Sky Blue", "Sand"],
    badge: "New",
    rating: 4.7,
    reviews: 67,
  },
  {
    id: "5",
    name: "Leather Chelsea Boots",
    price: 245,
    originalPrice: 320,
    description:
      "Handcrafted Chelsea boots in full-grain leather. Features elastic side panels, pull tab, and durable rubber sole. A classic silhouette that elevates any outfit.",
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop",
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Brown", "Black"],
    badge: "Sale",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "6",
    name: "Cotton Canvas Tote",
    price: 48,
    description:
      "Oversized canvas tote with reinforced handles and interior pocket. Made from heavyweight organic cotton. Carries everything you need in understated style.",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Natural", "Black"],
    rating: 4.4,
    reviews: 312,
  },
  {
    id: "7",
    name: "Merino Wool Scarf",
    price: 65,
    description:
      "Ultra-soft merino wool scarf with a generous length. Lightweight yet warm, perfect for year-round layering.",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Camel", "Grey", "Burgundy"],
    badge: "New",
    rating: 4.3,
    reviews: 45,
  },
  {
    id: "8",
    name: "Relaxed Fit Denim",
    price: 118,
    description:
      "Selvedge denim jeans with a comfortable relaxed fit. Raw indigo wash that will develop a unique patina over time.",
    category: "Pants",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Indigo", "Washed Black"],
    rating: 4.6,
    reviews: 178,
  },
];
