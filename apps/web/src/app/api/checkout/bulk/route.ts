import { db } from "@repo/database"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

interface CartItemData {
    productId: string
    quantity: number
    configPrice: number
    discount: number
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { cartItems }: { cartItems: CartItemData[] } = await request.json()

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 })
        }
        let dbUser = await db.user.findUnique({ where: { id: userId } })
        if (!dbUser) {
            const clerk = clerkClient
            const clerkUser = await clerk.users.getUser(userId)
            dbUser = await db.user.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                    phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
                },
            })
        }

        let shippingAddress = await db.shippingAddress.findFirst({
            where: { userId: userId },
        })
        if (!shippingAddress) {
            const clerk = clerkClient
            const clerkUser = await clerk.users.getUser(userId)
            shippingAddress = await db.shippingAddress.create({
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

        let totalPrice = 0
        const orderItemsData = []

        for (const item of cartItems) {
            const product = await db.product.findUnique({
                where: { productId: item.productId },
            })

            if (!product) {
                return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
            }

            const discountedPrice = item.configPrice * (1 - item.discount)
            const itemTotal = discountedPrice * item.quantity

            totalPrice += itemTotal

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                configPrice: item.configPrice,
                // يمكنك إضافة configurationId هنا إذا كان كل OrderItem يحتاج إلى ربط بتكوين معين
                // configurationId: product.configurationId, // إذا كان موجودًا في Product
            })
        }

        const shippingPrice = 69
        const finalTotal = totalPrice + shippingPrice

        // إنشاء الطلب الرئيسي
        const order = await db.orderaddfs.create({
            data: {
                userId: userId,
                productId: orderItemsData[0].productId, // أو يمكنك تعيينها إلى أي منتج افتراضي
                productName: `طلب متعدد المنتجات (${cartItems.length} صنف)`,
                productImages: [], // يمكن أن تكون فارغة أو تجمع صور المنتجات
                quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                productPrice: cartItems[0].configPrice, // أو متوسط السعر
                discountRate: cartItems[0].discount, // أو متوسط الخصم
                discountedPrice: totalPrice,
                totalPrice: finalTotal,
                configPrice: totalPrice,
                status: "awaiting_shipment",
                shippingPrice: shippingPrice,
                shippingAddressId: shippingAddress.id,
                productColorTemp: "warm", // قيم افتراضية
                productIp: "IP20", // قيم افتراضية
                productChandLamp: "lamp9w", // قيم افتراضية
                Brand: "multi-brand", // أو يمكنك تحديد العلامة التجارية الأكثر شيوعًا
                ChandelierLightingType: "LED", // قيم افتراضية
                
                // ربط OrderItems بالطلب
                orderItems: {
                    create: orderItemsData.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        configPrice: item.configPrice,
                        configurationId: item.configurationId,
                    })),
                },
            },
        })

        return NextResponse.json({ orderId: order.id })
    } catch (error) {
        console.error("Bulk checkout error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
