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

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Red", "Black", "Blue", "White", "Green"];

  function getRandomImage(category: string) {
    const images = {
      Shoes: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
      ],
      "T-Shirts": [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
      ],
      Hoodies: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
        "https://images.unsplash.com/photo-1680292783974-a9a336c10366",
        "https://images.unsplash.com/photo-1512400930990-e0bc0bd809df",
      ],
    };

    return faker.helpers.arrayElement(images[category as keyof typeof images]);
  }

  async function createRandomProduct() {
    const category = faker.helpers.arrayElement(categories);
    const name = faker.commerce.productName();

    const price = Number(faker.commerce.price({ min: 1000, max: 10000 }));
    const originalPrice = price + faker.number.int({ min: 500, max: 2000 });

    const baseSku = faker.string.alphanumeric(6).toUpperCase();
    const image = getRandomImage(category.name);

    return prisma.product.create({
      data: {
        name,
        description: faker.commerce.productDescription(),
        price,
        originalPrice,
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        reviews: faker.number.int({ min: 0, max: 200 }),
        thumbnail: image,
        categoryId: category.id,

        variants: {
          create: Array.from({ length: 3 }).map(() => ({
            sku: `${baseSku}-${faker.string.alphanumeric(4).toUpperCase()}`,
            size: faker.helpers.arrayElement(sizes),
            color: faker.helpers.arrayElement(colors),
            stock: faker.number.int({ min: 0, max: 10 }),
            images: [image],
          })),
        },
      },
    });
  }

  // 🔥 Create 30 random products
  for (let i = 0; i < 30; i++) {
    await createRandomProduct();
  }

  console.log("Database seeded with 30 random products 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
