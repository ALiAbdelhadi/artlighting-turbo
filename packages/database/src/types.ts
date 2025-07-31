export type * from '@prisma/client'

import type {
    User,
    Product,
    Order,
    OrderItem,
    Configuration,
    ShippingAddress,
    Cart,
    CartItem,
    Category,
    LightingType,
    OrderStatus,
    ProductColorTemp,
    ProductIP,
    ProductChandLamp,
    Prisma
} from '@prisma/client'

export interface OrderWithDetails extends Order {
    orderItems: (OrderItem & {
        product: Product
        configuration: Configuration | null
    })[]
    user: User
    shippingAddress: ShippingAddress | null
    configuration: Configuration | null
}

export interface ProductWithStats extends Product {
    category: Category
    lightingtype: LightingType
    _count: {
        orders: number
        orderItems: number
        cartItems: number
    }
    totalRevenue?: number
    totalQuantitySold?: number
}

export interface UserWithDetails extends User {
    orders: Order[]
    shippingAddress: ShippingAddress | null
    cart: Cart | null
    configuration: Configuration | null
    _count: {
        orders: number
    }
    totalSpent?: number
}

export interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
    pendingOrders: number
    completedOrders: number
    recentOrders: OrderWithDetails[]
    topProducts: ProductWithStats[]
    monthlyRevenue: { month: string; revenue: number }[]
    ordersByStatus: { status: OrderStatus; count: number }[]
}

// Configuration with related data
export interface ConfigurationWithDetails extends Configuration {
    orders: Order[]
    users: User[]
    orderItems: OrderItem[]
}

// Cart with items and products
export interface CartWithItems extends Cart {
    items: (CartItem & {
        product: Product
    })[]
    user: User
}

// Query helpers types based on your schema
export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        category: true
        lightingtype: true
        orders: true
        orderItems: true
        cartItems: true
    }
}>

export type OrderWithFullDetails = Prisma.OrderGetPayload<{
    include: {
        orderItems: {
            include: {
                product: true
                configuration: true
            }
        }
        user: true
        shippingAddress: true
        configuration: true
    }
}>

export type UserWithAllRelations = Prisma.UserGetPayload<{
    include: {
        orders: true
        shippingAddress: true
        cart: {
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        }
        configuration: true
    }
}>

// Admin analytics types
export interface ProductPerformance {
    productId: string
    productName: string
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    category: string
    brand: string
}

export interface CustomerAnalytics {
    userId: string
    email: string | null
    phoneNumber: string | null
    totalOrders: number
    totalSpent: number
    averageOrderValue: number
    lastOrderDate: Date | null
    registrationDate: Date
}

export interface RevenueAnalytics {
    period: string
    revenue: number
    orders: number
    averageOrderValue: number
    topCategory: string
    topProduct: string
}