"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@repo/database";
import { redirect } from "next/navigation";

export const DashboardServer = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  if (!userId || !user) {
    return redirect("/404");
  }
  
  const orders = await db.order.findMany({
    where: {
      isCompleted: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      shippingAddress: true,
      product: true,
      configuration: true,
    },
  });

  const totalCustomers = await db.user.count();
  const totalOrdersThatOrdered = await db.order.count({
    where: {
      isCompleted: true,
    },
  });

  const TotalSales = await db.order.aggregate({
    where: {
      isCompleted: true,
    },
    _sum: {
      totalPrice: true,
    },
  });

  const simplifiedOrders = orders.map((order) => {
    const discountRate =
      order.product.discount ?? order.configuration.discount ?? 0; // Fetch discount for each product
    let totalPrice;
    if (discountRate > 0) {
      const discountedPrice = order.configPrice * (1 - discountRate);
      totalPrice = discountedPrice * order.quantity + order.shippingPrice;
    } else {
      totalPrice = order.configPrice * order.quantity + order.shippingPrice;
    }

    return {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      productPrice: order.productPrice,
      shippingPrice: order.shippingPrice,
      quantity: order.quantity,
      totalPrice: totalPrice,
      configPrice: order.configPrice,
      discountRate: discountRate,
      user: {
        id: order.user.id,
        email: order.user.email,
        phoneNumber: order.user.phoneNumber,
      },
      product: {
        id: order.product.id,
        productName: order.product.productName,
      },
      shippingAddress: order.shippingAddress
        ? {
            id: order.shippingAddress.id,
            fullName: order.shippingAddress.fullName,
          }
        : null,
    };
  });

  const result = {
    orders: simplifiedOrders,
    totalCustomers,
    totalOrdersThatOrdered,
    TotalSales: {
      _sum: {
        totalPrice: TotalSales._sum.totalPrice,
      },
    },
    user: {
      imageUrl: user.imageUrl,
    },
  };

  console.log("Dashboard data fetched:", result);
  return JSON.parse(JSON.stringify(result));
};
