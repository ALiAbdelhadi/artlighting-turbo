"use client"

import ColorTemperatureSection from "@/components/color-temperature-section"
import { Container } from "@/components/container"
import ProductCard from "@/components/product-card/product-card"
import ProductFeatures from "@/components/product-features"
import ProductImages from "@/components/product-images"
import ProductMainInfo from "@/components/product-main-Info"
import ProductSpecifications from "@/components/product-specifications-table"
import { ConfigurationData, ProductWithRelations, SpecificationsTable } from "@/types/products"
import type { Order, OrderStatus } from "@prisma/client"
import { motion, type Variants } from "framer-motion"
import * as React from "react"
import { useState } from "react"

interface ProductClientComponentProps {
  children: React.ReactNode
  product: ProductWithRelations
  configuration?: ConfigurationData
  relatedProducts: ProductWithRelations[]
}

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], 
    },
  },
}

export default function ProductClientComponent({
  children,
  product,
  relatedProducts,
  configuration,
}: ProductClientComponentProps) {
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const order: Order = {
    id: 0,
    userId: "",
    productId: product.productId,
    productName: product.productName,
    productImages: product.productImages,
    productColorTemp: product.productColor || "warm",
    productIp: product.productIp || "IP20",
    productChandLamp: product.productChandLamp || "lamp9w",
    quantity: quantity,
    isCompleted: false,
    status: "awaiting_shipment" as OrderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    configurationId: configuration?.id || "",
    productPrice: product.price,
    discountedPrice: null,
    discountApplied: false,
    discountRate: null,
    totalPrice: product.price * quantity,
    configPrice: configuration?.configPrice || product.price,
    priceIncrease: configuration?.priceIncrease || 0,
    Brand: product.Brand,
    ChandelierLightingType: product.ChandelierLightingType || "",
    shippingPrice: 69,
    shippingAddressId: null,
    OrderTimeReceived: null,
  }

  const specificationsTable: SpecificationsTable = {
    Input: product.input || "",
    "Maximum wattage": product.maximumWattage?.toString() || "",
    "Brand Of Led": product.brandOfLed || "",
    "Luminous Flux": product.luminousFlux || "",
    "Main Material": product.mainMaterial || "",
    CRI: product.cri || "",
    "Beam Angle": product.beamAngle || "",
    "Working Temperature": product.workingTemperature || "",
    "Fixture Dimmable": product.fixtureDimmable || "",
    Electrical: product.electrical || "",
    "Power Factor": product.powerFactor || "",
    "Color Temperature": product.colorTemperature || "",
    IP: product.ip?.toString() || "",
    "Energy Saving": product.energySaving || "",
    "Life Time": product.lifeTime || "",
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
      <div className="py-8 md:py-16">
        <Container>
          <div className="space-y-12">
            <div className="flex items-start  gap-8">
              <ProductImages productImages={product.productImages} />
              <ProductMainInfo
                productName={product.productName}
                price={product.price}
                quantity={quantity}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                specificationsTable={specificationsTable}
                ProductId={product.productId}
                configId={configuration?.id || product.id}
                discount={product.discount}
                order={order}
                colorTemperature={product.colorTemperature || ""}
                Brand={product.Brand}
                ChandelierLightingType={product.ChandelierLightingType || ""}
                hNumber={product.hNumber}
                configuration={configuration}
                sectionTypes={[product.sectionType]}
                sectionType={product.sectionType}
                maximumWattage={product.maximumWattage || 0}
                mainMaterial={product.mainMaterial || ""}
                beamAngle={product.beamAngle || ""}
                spotlightType={product.spotlightType}
                luminousFlux={product.luminousFlux || ""}
                lifeTime={product.lifeTime || ""}
                energySaving={product.energySaving || ""}
                cri={product.cri || ""}
                brandOfLed={product.brandOfLed || ""}
                electrical={product.electrical || ""}
                finish={product.finish || undefined} // Convert null to undefined
                input={product.input || undefined} // Convert null to undefined
                lampBase={product.lampBase || undefined} // Convert null to undefined
                ip={product.ip || 20}
              />
            </div>

            <div className="space-y-12">
              <ProductSpecifications
                specificationsTable={specificationsTable}
                productName={product.productName}
                Brand={product.Brand}
                ChandelierLightingType={product.ChandelierLightingType || undefined}
                hNumber={product.hNumber}
                sectionType={product.sectionType}
              />

              <ProductFeatures specificationsTable={specificationsTable} />

              <ColorTemperatureSection specificationsTable={specificationsTable} />

              {/* Related Products Section */}
              <section className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-semibold">Related Products</h2>
                  {relatedProducts.length > 0 ? (
                    <p className="text-muted-foreground text-lg">Products you might also like</p>
                  ) : (
                    <p className="text-muted-foreground text-lg">No related products found</p>
                  )}
                </div>

                {relatedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct) => (
                      <ProductCard
                        key={relatedProduct.productId}
                        product={
                          {
                            ...relatedProduct,
                            ProductId: relatedProduct.productId,
                            // Ensure all required fields are present and properly typed
                            ChandelierLightingType: relatedProduct.ChandelierLightingType || "",
                          } as any
                        } // Temporary type assertion - you may need to fix ProductCard props
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </Container>
      </div>
    </motion.div>
  )
}
