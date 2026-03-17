"use server";
import crypto from "crypto";

import prisma from "@/lib/prisma";
import {
  ActionResponse,
  Address,
  Category,
  HomeProduct,
  SingleProduct,
} from "./types";
import razorpay from "@/lib/razorpay";
import { CartItem } from "./contexts/cart-context";
import { auth } from "@clerk/nextjs/server";

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
            sku: true,
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
    const user = await auth();
    if (!user || !user.userId) {
      return {
        success: false,
        error: "User not authenticated",
        status: 401,
      };
    }
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

export async function getVariantBySku(
  sku: string,
): Promise<ActionResponse<SingleProduct["variants"][0]>> {
  try {
    const res = await prisma.productVariant.findUnique({
      where: { sku },
      select: {
        id: true,
        sku: true,
        size: true,
        color: true,
        images: true,
        stock: true,
      },
    });

    if (!res) {
      return {
        success: false,
        error: "Variant not found",
        status: 404,
      };
    }
    return {
      success: true,
      message: "Variant fetched successfully",
      status: 200,
      data: res,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to fetch product variant",
      status: 500,
    };
  }
}

export async function createUserAddress(
  userId: string,
  addressData: Omit<Address, "id" | "userId">,
): Promise<ActionResponse<Address | null>> {
  try {
    const user = await auth();
    if (!user || !user.userId) {
      return {
        success: false,
        error: "User not authenticated",
        status: 401,
      };
    }
    const existingAddress = await prisma.address.findUnique({
      where: {
        userId,
      },
    });
    if (existingAddress) {
      return {
        success: true,
        message: "Address already exists for this user",
        status: 400,
        data: null,
      };
    }
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

export async function createOrder(
  cartItems: CartItem[],
): Promise<ActionResponse<{ order: any }>> {
  const amount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  try {
    const user = await auth();
    if (!user || !user.userId) {
      return {
        success: false,
        error: "User not authenticated",
        status: 401,
      };
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return {
        success: false,
        error: "Failed to create order",
        status: 500,
      };
    }
    const items = cartItems.map((item) => ({
      sku: item.sku,
      price: item.product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    await prisma.order.create({
      data: {
        userId: user.userId,
        items,
        total: amount,
        status: "Pending",
        razorpayOrderId: order.id,
      },
    });
    return {
      success: true,
      message: "Order created successfully",
      status: 201,
      data: { order },
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to create order",
      status: 500,
    };
  }
}

export async function verifyPayment(
  response: any,
  cartItems: CartItem[],
): Promise<ActionResponse<null>> {
  try {
    const user = await auth();
    if (!user || !user.userId) {
      return {
        success: false,
        error: "User not authenticated",
        status: 401,
      };
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      cartItems.forEach(async (item) => {
        const variant = await getVariantBySku(item.sku);
        if (!variant || !variant.success) {
          return {
            success: false,
            error: `Variant with SKU ${item.sku} not found`,
            status: 404,
          };
        }
        await prisma.productVariant.update({
          where: {
            sku: item.sku,
          },
          data: {
            stock: variant.data.stock - item.quantity,
          },
        });
      });
      await prisma.order.update({
        where: {
          razorpayOrderId: razorpay_order_id,
        },
        data: {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
        },
      });
      return {
        success: true,
        message: "Payment verified successfully",
        status: 200,
        data: null,
      };
    } else {
      return {
        success: false,
        error: "Invalid payment signature",
        status: 400,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to verify payment",
      status: 500,
    };
  }
}

export async function deleteOrder(
  orderId: string,
): Promise<ActionResponse<null>> {
  try {
    const res = await prisma.order.delete({
      where: {
        razorpayOrderId: orderId,
      },
    });

    if (!res) {
      return {
        success: false,
        error: "Failed to delete order",
        status: 500,
      };
    }
    return {
      success: true,
      message: "Order deleted successfully",
      status: 200,
      data: null,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to delete order",
      status: 500,
    };
  }
}
