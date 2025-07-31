import { db } from "@repo/database"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const cart = await db.cart.findUnique({
            where: { userId },
        })

        if (cart) {
            await db.cartItem.deleteMany({
                where: { cartId: cart.id },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error clearing cart:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
