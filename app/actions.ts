"use server";

import prisma from "@/lib/prisma";
import {
  ActionResponse,
  Address,
  Category,
  HomeProduct,
  SingleProduct,
} from "./types";

export async function getCategories(): Promise<ActionResponse<Category[]>> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!categories) {
      return {
        success: false,
        error: "Failed to fetch categories",
        status: 500,
      };
    }

    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "Failed to fetch categories",
      status: 500,
    };
  }
}
export async function getHomeProducts(): Promise<
  ActionResponse<{ featured: HomeProduct[]; newArrivals: HomeProduct[] }>
> {
  try {
    const featuredInDb = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        badge: true,
        thumbnail: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 4,
    });

    const featured = featuredInDb.map((p) => ({
      ...p,
      price: Number(p.price),
      badge: p.badge || undefined,
    }));

    const newArrivalsInDb = await prisma.product.findMany({
      where: {
        badge: "New",
      },
      select: {
        id: true,
        name: true,
        price: true,
        badge: true,
        thumbnail: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 4,
    });

    const newArrivals = newArrivalsInDb.map((p) => ({
      ...p,
      price: Number(p.price),
      badge: p.badge || undefined,
    }));

    if (!featured || !newArrivals) {
      return {
        success: false,
        error: "Failed to fetch products",
        status: 500,
      };
    }

    return {
      success: true,
      message: "Products fetched successfully",
      status: 200,
      data: {
        featured,
        newArrivals,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to fetch products",
      status: 500,
    };
  }
}

export async function getProducts(
  page: number = 1,
  category?: string,
  sort?: string,
  badge?: string,
  limit: number = 12,
): Promise<ActionResponse<{ products: HomeProduct[]; totalPages: number }>> {
  const skip = (page - 1) * limit;
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  }
  if (sort === "price-desc") {
    orderBy = { price: "desc" };
  }
  if (sort === "rating") {
    orderBy = { rating: "desc" };
  }

  let where: any = undefined;

  if (category) {
    where = {
      category: {
        name: category,
      },
    };
  }

  if (badge) {
    where = {
      ...where,
      badge,
    };
  }

  try {
    const [products, totalPages] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy,
        where,
        select: {
          id: true,
          name: true,
          price: true,
          badge: true,
          thumbnail: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.product.count(),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
      badge: p.badge || undefined,
    }));

    return {
      success: true,
      message: "Products fetched successfully",
      status: 200,
      data: {
        products: formattedProducts,
        totalPages: Math.ceil(totalPages / limit),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to fetch products",
      status: 500,
    };
  }
}

export async function getProductById(
  productId: string,
): Promise<ActionResponse<SingleProduct>> {
  try {
    const res = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        originalPrice: true,
        price: true,
        badge: true,
        rating: true,
        reviews: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            images: true,
            stock: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!res) {
      return {
        success: false,
        error: "Product not found",
        status: 404,
      };
    }

    const formattedProduct = {
      ...res,
      price: Number(res.price),
      originalPrice: res.originalPrice ? Number(res.originalPrice) : undefined,
      rating: Number(res.rating),
      badge: res.badge || undefined,
    };

    return {
      success: true,
      message: "Product fetched successfully",
      status: 200,
      data: formattedProduct,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to fetch product",
      status: 500,
    };
  }
}

export async function getUserAddressById(
  userId: string,
): Promise<ActionResponse<Address>> {
  try {
    const address = await prisma.address.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        street: true,
        apt: true,
        city: true,
        state: true,
        pin: true,
        country: true,
        phone: true,
        userId: true,
      },
    });
    if (!address) {
      return {
        success: false,
        error: "Address not found",
        status: 404,
      };
    }
    return {
      success: true,
      message: "Address fetched successfully",
      status: 200,
      data: address,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to fetch user address",
      status: 500,
    };
  }
}

export async function createUserAddress(
  userId: string,
  addressData: Omit<Address, "id" | "userId">,
) {
  try {
    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    if (!address) {
      return {
        success: false,
        error: "Failed to create user address",
        status: 500,
      };
    }
    return {
      success: true,
      message: "Address created successfully",
      status: 201,
      data: address,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to create user address",
      status: 500,
    };
  }
}
