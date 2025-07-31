"use server";
import { db } from "@repo/database";
import { auth } from "@clerk/nextjs/server";
export const getUserStatus = async ({ orderId }: { orderId: number }) => {
  try {
    const { userId } =  await auth();
    if (!userId) {
      console.log("User Not authenticated");
      throw new Error("You need to be logged in");
    }
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        shippingAddress: true,
        configuration: true,
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== userId) {
      throw new Error("You do not have permission to view this order");
    }
    return order;
  } catch (error) {
    console.log("Error in getUserStatus", error);
    throw error;
  }
};