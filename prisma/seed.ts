import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { faker } from "@faker-js/faker";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  interface ProductProps {
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    thumbnail: string;
    categoryId: string;
    variants: {
      sku: string;
      size: string;
      color: string;
      stock: number;
      images: string[];
    }[];
  }

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Shoes",
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      },
    }),
    prisma.category.create({
      data: {
        name: "T-Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hoodies",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      },
    }),
  ]);

  const PRODUCTS = [
    {
      name: "Men Air Max Alpha Trainer 5 Shoes",
      description:
        "Nike is a leading American sports brand recognised for combining forward-thinking design with clear functionality. Its collections deliver fresh approaches to movement, blending purposeful detailing with bold silhouettes across footwear and apparel.",
      price: 4497,
      originalPrice: 7495,
      thumbnail: "/images/shoe-1-black.jpg",
      categoryId: categories[0].id,
      variants: [
        {
          sku: "SHOE-001-BLK-L",
          size: "L",
          color: "Black",
          stock: 10,
          images: [
            "/images/shoe-1-black.jpg",
            "/images/shoe-1-black2.jpg",
            "/images/shoe-1-black3.jpg",
          ],
        },
      ],
    },
    {
      name: "NIKE Men Air Max 90 Sneakers",
      description:
        "Nike is a leading American sports brand recognised for combining forward-thinking design with clear functionality. Its collections deliver fresh approaches to movement, blending purposeful detailing with bold silhouettes across footwear and apparel.",
      price: 6397,
      originalPrice: 9995,
      thumbnail: "/images/shoe-2-grey.jpg",
      categoryId: categories[0].id,
      variants: [
        {
          sku: "SHOE-002-GRY-M",
          size: "M",
          color: "Grey",
          stock: 10,
          images: [
            "/images/shoe-2-grey.jpg",
            "/images/shoe-2-grey2.jpg",
            "/images/shoe-2-grey3.jpg",
          ],
        },
        {
          sku: "SHOE-002-GRY-L",
          size: "L",
          color: "Grey",
          stock: 10,
          images: [
            "/images/shoe-2-grey.jpg",
            "/images/shoe-2-grey2.jpg",
            "/images/shoe-2-grey3.jpg",
          ],
        },
      ],
    },
    {
      name: "ADIDAS ORIGINALS Men Samba OG Sneakers",
      description:
        "From football pitches to skate parks to the streets, the adidas samba shoes have been kicking it for more than 70 years.This pair stays true to the og style with a smooth leather upper, reinforced t-toe and heritage details like the serrated 3-stripes.",
      price: 10999,
      originalPrice: 14999,
      thumbnail: "/images/shoe-3-red.jpg",
      categoryId: categories[0].id,
      variants: [
        {
          sku: "SHOE-003-RED-M",
          size: "M",
          color: "Red",
          stock: 10,
          images: [
            "/images/shoe-3-red.jpg",
            "/images/shoe-3-red2.jpg",
            "/images/shoe-3-red3.jpg",
          ],
        },
        {
          sku: "SHOE-003-RED-L",
          size: "L",
          color: "Red",
          stock: 10,
          images: [
            "/images/shoe-3-red.jpg",
            "/images/shoe-3-red2.jpg",
            "/images/shoe-3-red3.jpg",
          ],
        },
        {
          sku: "SHOE-003-RED-XL",
          size: "XL",
          color: "Red",
          stock: 10,
          images: [
            "/images/shoe-3-red.jpg",
            "/images/shoe-3-red2.jpg",
            "/images/shoe-3-red3.jpg",
          ],
        },
      ],
    },
    {
      name: "ADIDAS ORIGINALS Men Handball Spezial Sneakers",
      description: "Leather & synthetic upper.",
      price: 10999,
      originalPrice: 14999,
      thumbnail: "/images/shoe-4-black.jpg",
      categoryId: categories[0].id,
      variants: [
        {
          sku: "SHOE-004-BLK-M",
          size: "M",
          color: "Black",
          stock: 10,
          images: [
            "/images/shoe-4-black.jpg",
            "/images/shoe-4-black2.jpg",
            "/images/shoe-4-black3.jpg",
          ],
        },
        {
          sku: "SHOE-004-BLK-XL",
          size: "XL",
          color: "Black",
          stock: 10,
          images: [
            "/images/shoe-4-black.jpg",
            "/images/shoe-4-black2.jpg",
            "/images/shoe-4-black3.jpg",
          ],
        },
      ],
    },
    {
      name: "ADIDAS ORIGINALS Men Ozweego Sneakers",
      description:
        "They have a lightweight mesh upper with suede and TPU overlays and an EVA midsole for maximum shock absorption.",
      price: 8709,
      originalPrice: 12999,
      thumbnail: "/images/shoe-5-black.jpg",
      categoryId: categories[0].id,
      variants: [
        {
          sku: "SHOE-005-BLK-L",
          size: "L",
          color: "Black",
          stock: 10,
          images: [
            "/images/shoe-5-black.jpg",
            "/images/shoe-5-black2.jpg",
            "/images/shoe-5-black3.jpg",
          ],
        },
        {
          sku: "SHOE-005-BLK-XL",
          size: "XL",
          color: "Black",
          stock: 10,
          images: [
            "/images/shoe-5-black.jpg",
            "/images/shoe-5-black2.jpg",
            "/images/shoe-5-black3.jpg",
          ],
        },
      ],
    },
    {
      name: "ADIDAS Typography Printed India T20 International Cricket Fan Jersey",
      description:
        "Celebrate the roar of a billion fans with the India T20 Fan Jersey. The two stars honour India's T20 World Cup triumphs, while the tri-colour details, bold stripes and vibrant blues capture the energy of true supporters. Lightweight, breathable and made with recycled materials, it keeps you comfortable as you cheer every moment.",
      price: 999,
      originalPrice: 1099,
      thumbnail: "/images/tshirt-1-blue.jpg",
      categoryId: categories[1].id,
      variants: [
        {
          sku: "TSHIRT-001-BLU-L",
          size: "L",
          color: "Blue",
          stock: 10,
          images: ["/images/tshirt-1-blue.jpg", "/images/tshirt-1-blue2.jpg"],
        },
        {
          sku: "TSHIRT-001-BLU-XL",
          size: "XL",
          color: "Blue",
          stock: 10,
          images: ["/images/tshirt-1-blue.jpg", "/images/tshirt-1-blue2.jpg"],
        },
      ],
    },
    {
      name: "ADIDAS 3-Striped Logo Detail Polo T-shirt",
      description:
        "Upgrade your casual look with the Adidas Mens Striped Polo T-Shirt. Featuring the classic three-stripe design and crafted from a soft cotton blend, this polo offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with Adidas.",
      price: 1049,
      originalPrice: 1499,
      thumbnail: "/images/tshirt-2-grey.jpg",
      categoryId: categories[1].id,
      variants: [
        {
          sku: "TSHIRT-002-GRE-L",
          size: "L",
          color: "Grey",
          stock: 10,
          images: [
            "/images/tshirt-2-grey.jpg",
            "/images/tshirt-2-grey2.jpg",
            "/images/tshirt-2-grey3.jpg",
          ],
        },
        {
          sku: "TSHIRT-002-GRE-XL",
          size: "XL",
          color: "Grey",
          stock: 10,
          images: [
            "/images/tshirt-2-grey.jpg",
            "/images/tshirt-2-grey2.jpg",
            "/images/tshirt-2-grey3.jpg",
          ],
        },
      ],
    },
    {
      name: "TOM MILTON Men Printed T-shirt",
      description:
        "Upgrade your casual look with the TOM MILTON Men Printed T-shirt. Featuring the classic three-stripe design and crafted from a soft cotton blend, this t-shirt offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with TOM MILTON.",
      price: 497,
      originalPrice: 1799,
      thumbnail: "/images/tshirt-3-black.jpg",
      categoryId: categories[1].id,
      variants: [
        {
          sku: "TSHIRT-003-BLK-L",
          size: "L",
          color: "Black",
          stock: 10,
          images: ["/images/tshirt-3-black.jpg"],
        },
        {
          sku: "TSHIRT-003-BLU-XL",
          size: "XL",
          color: "Blue",
          stock: 10,
          images: ["/images/tshirt-3-blue.jpg"],
        },
      ],
    },
    {
      name: "Calvin Klein Jeans Men Brand Logo Polo Collar T-shirt",
      description:
        "Upgrade your casual look with the Calvin Klein Jeans Men Brand Logo Polo Collar T-shirt. Featuring the classic three-stripe design and crafted from a soft cotton blend, this t-shirt offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with Calvin Klein Jeans.",
      price: 4093,
      originalPrice: 4599,
      thumbnail: "/images/tshirt-4-black.jpg",
      categoryId: categories[1].id,
      variants: [
        {
          sku: "TSHIRT-004-BLK-L",
          size: "L",
          color: "Black",
          stock: 10,
          images: ["/images/tshirt-4-black.jpg", "/images/tshirt-4-black2.jpg"],
        },
        {
          sku: "TSHIRT-004-BLK-M",
          size: "M",
          color: "Black",
          stock: 10,
          images: ["/images/tshirt-4-black.jpg", "/images/tshirt-4-black2.jpg"],
        },
      ],
    },
    {
      name: "H&M Men Loose Fit Printed Hoodie",
      description:
        "Upgrade your casual look with the H&M Men Loose Fit Printed Hoodie. Featuring the classic three-stripe design and crafted from a soft cotton blend, this hoodie offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with H&M.",
      price: 1499,
      originalPrice: 1999,
      thumbnail: "/images/hoodie-1-offwhite.jpg",
      categoryId: categories[2].id,
      variants: [
        {
          sku: "HOODIE-001-OFW-L",
          size: "L",
          color: "Off White",
          stock: 10,
          images: [
            "/images/hoodie-1-offwhite.jpg",
            "/images/hoodie-1-offwhite2.jpg",
          ],
        },
        {
          sku: "HOODIE-001-OFW-M",
          size: "M",
          color: "Off White",
          stock: 10,
          images: [
            "/images/hoodie-1-offwhite.jpg",
            "/images/hoodie-1-offwhite2.jpg",
          ],
        },
      ],
    },
    {
      name: "NOBERO Men Printed Hooded Sweatshirt",
      description:
        "Upgrade your casual look with the NOBERO Men Printed Hooded Sweatshirt. Featuring the classic three-stripe design and crafted from a soft cotton blend, this sweatshirt offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with NOBERO.",
      price: 978,
      originalPrice: 3799,
      thumbnail: "/images/hoodie-2-green.jpg",
      categoryId: categories[2].id,
      variants: [
        {
          sku: "HOODIE-002-GRN-L",
          size: "L",
          color: "Green",
          stock: 10,
          images: ["/images/hoodie-2-green.jpg", "/images/hoodie-2-green2.jpg"],
        },
        {
          sku: "HOODIE-002-GRN-M",
          size: "M",
          color: "Green",
          stock: 10,
          images: ["/images/hoodie-2-green.jpg", "/images/hoodie-2-green2.jpg"],
        },
      ],
    },
    {
      name: "H&M Loose Fit Hoodie",
      description:
        "Upgrade your casual look with the H&M Loose Fit Hoodie. Featuring the classic three-stripe design and crafted from a soft cotton blend, this hoodie offers a comfortable, tailored fit. Its timeless style, with a ribbed collar and button placket, makes it a versatile choice for any occasion. Embrace sporty elegance with H&M.",
      price: 1499,
      originalPrice: 1999,
      thumbnail: "/images/hoodie-3-grey.jpg",
      categoryId: categories[2].id,
      variants: [
        {
          sku: "HOODIE-003-GRE-L",
          size: "L",
          color: "Grey",
          stock: 10,
          images: ["/images/hoodie-3-grey.jpg", "/images/hoodie-3-grey2.jpg"],
        },
        {
          sku: "HOODIE-003-BLU-M",
          size: "M",
          color: "Blue",
          stock: 10,
          images: ["/images/hoodie-3-blue.jpg", "/images/hoodie-3-blue2.jpg"],
        },
      ],
    },
  ];

  async function createProduct({
    name,
    description,
    price,
    originalPrice,
    thumbnail,
    categoryId,
    variants,
  }: ProductProps) {
    return prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        rating: (Math.random() * (10 - 1) + 1).toFixed(2),
        reviews: Math.floor(Math.random() * 200) + 1,
        thumbnail,
        categoryId,

        variants: {
          create: variants.map((variant) => ({
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            images: variant.images,
          })),
        },
      },
    });
  }

  await Promise.all(PRODUCTS.map((prod) => createProduct(prod)));

  console.log("Database seeded! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
