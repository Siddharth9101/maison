"use server";

import prisma from "@/lib/prisma";
import { ActionResponse, HomeProduct } from "./types";

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
