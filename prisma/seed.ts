import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

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

  const shoes = await prisma.category.create({
    data: {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    },
  });

  const tshirts = await prisma.category.create({
    data: {
      name: "T-Shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
  });

  const hoodies = await prisma.category.create({
    data: {
      name: "Hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    },
  });

  async function createProduct(
    name: string,
    price: number,
    originalPrice: number,
    categoryId: string,
    baseSku: string,
    image: string,
  ) {
    return prisma.product.create({
      data: {
        name,
        description: `${name} premium quality product.`,
        price,
        originalPrice,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 150),
        thumbnail: image,
        categoryId,

        variants: {
          create: [
            {
              sku: `${baseSku}-M-RD`,
              size: "M",
              color: "Red",
              stock: 5,
              images: [image],
            },
            {
              sku: `${baseSku}-L-BK`,
              size: "L",
              color: "Black",
              stock: 4,
              images: [image],
            },
            {
              sku: `${baseSku}-M-BL`,
              size: "M",
              color: "Blue",
              stock: 3,
              images: [image],
            },
          ],
        },
      },
    });
  }

  // Shoes
  await createProduct(
    "Nike Air Max Runner",
    7999,
    9999,
    shoes.id,
    "AIRMAX",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  );

  await createProduct(
    "Adidas Ultraboost",
    8999,
    10999,
    shoes.id,
    "ULTRA",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  );

  await createProduct(
    "Puma Velocity Nitro",
    7499,
    8999,
    shoes.id,
    "VELO",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
  );

  await createProduct(
    "Reebok Floatride Energy",
    6999,
    8499,
    shoes.id,
    "FLOAT",
    "https://images.unsplash.com/photo-1528701800489-20be3c7c5e2d",
  );

  await createProduct(
    "New Balance Fresh Foam",
    8299,
    9999,
    shoes.id,
    "FOAM",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3",
  );

  // T-Shirts
  await createProduct(
    "Nike Sportswear Tee",
    1999,
    2499,
    tshirts.id,
    "NIKE-TEE",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  );

  await createProduct(
    "Adidas Essentials Tee",
    1799,
    2199,
    tshirts.id,
    "AD-TEE",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
  );

  await createProduct(
    "Puma Casual Tee",
    1699,
    2099,
    tshirts.id,
    "PUMA-TEE",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4c84",
  );

  await createProduct(
    "Levis Classic Tee",
    1899,
    2399,
    tshirts.id,
    "LEVIS-TEE",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  );

  await createProduct(
    "Under Armour Training Tee",
    2199,
    2699,
    tshirts.id,
    "UA-TEE",
    "https://images.unsplash.com/photo-1593032465171-8a03e9a5df5d",
  );

  // Hoodies
  await createProduct(
    "Nike Club Fleece Hoodie",
    3999,
    4999,
    hoodies.id,
    "NIKE-HOOD",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  );

  await createProduct(
    "Adidas Essentials Hoodie",
    3799,
    4599,
    hoodies.id,
    "AD-HOOD",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  );

  await createProduct(
    "Puma Logo Hoodie",
    3499,
    4299,
    hoodies.id,
    "PUMA-HOOD",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  );

  await createProduct(
    "Levis Relaxed Hoodie",
    4299,
    5199,
    hoodies.id,
    "LEVIS-HOOD",
    "https://images.unsplash.com/photo-1556906781-9a412961c28c",
  );

  await createProduct(
    "Champion Powerblend Hoodie",
    4099,
    4999,
    hoodies.id,
    "CHAMP-HOOD",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  );

  console.log("Database seeded 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
