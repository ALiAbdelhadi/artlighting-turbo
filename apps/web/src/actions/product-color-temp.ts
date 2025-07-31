"use server";
import { ProductColorTemp } from "@prisma/client";
import { db } from "@repo/database";


export const changeProductColorTemp = async ({
  productId,
  newColorTemp,
}: {
  productId: string;
  newColorTemp: ProductColorTemp;
}) => {
  await db.product.update({
    where: { productId },
    data: { productColor: newColorTemp },
  });
};
