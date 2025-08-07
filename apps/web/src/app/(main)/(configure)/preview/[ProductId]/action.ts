"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@repo/database"

export async function createOrder({
  configId,
  quantity,
}: {
  configId: string
  quantity: number
}) {
  console.log("Starting createOrder function")

  try {
    const { userId } = await auth()
    if (!userId) {
      console.error("User not authenticated")
      throw new Error("You need to be logged in")
    }

    const configuration = await prisma.configuration.findUnique({
      where: { id: configId },
    })

    if (!configuration) {
      console.error("Configuration not found")
      throw new Error("Configuration not found")
    }

    const product = await prisma.product.findUnique({
      where: { productId: configuration.ProductId },
    })

    if (!product) {
      console.error("Product not found")
      throw new Error("Product not found")
    }

    let dbUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!dbUser) {
      // Get the Clerk client instance properly
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)

      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
        },
      })
    }

    let shippingAddress = await prisma.shippingAddress.findFirst({
      where: { userId: userId },
    })

    if (!shippingAddress) {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)

      shippingAddress = await prisma.shippingAddress.create({
        data: {
          userId: userId,
          fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
        },
      })
    }

    const discountedPrice = configuration.totalPrice - configuration.totalPrice * configuration.discount
    const shippingPrice = configuration.shippingPrice
    const finalPrice = discountedPrice * quantity + shippingPrice

    const order = await prisma.order.create({
      data: {
        userId: userId,
        configurationId: configId,
        productId: product.id,
        quantity: quantity,
        productPrice: configuration.totalPrice,
        discountRate: configuration.discount,
        discountedPrice: discountedPrice,
        totalPrice: finalPrice,
        configPrice: configuration.totalPrice,
        productName: product.productName,
        productImages: product.productImages,
        status: "awaiting_shipment",
        shippingPrice: shippingPrice,
        shippingAddressId: shippingAddress.id,
        productColorTemp: product.productColor || "",
        productIp: product.productIp || "",
        productChandLamp: product.productChandLamp || "",
        Brand: product.Brand,
        ChandelierLightingType: product.ChandelierLightingType,
      },
    })

    console.log("Order created successfully", {
      userId: userId,
      orderId: order.id,
      productId: product.id,
    })

    return { userId: userId, orderId: order.id, productId: product.id }
  } catch (error) {
    console.error("Error in createOrder:", error)
    throw error
  }
}
