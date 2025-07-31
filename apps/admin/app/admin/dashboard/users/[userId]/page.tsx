import { db } from "@repo/database";
import { notFound } from "next/navigation";
import UserClient from "./user-client";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  console.log("Received params:", params);
  console.log("Searching for user with ID:", params.userId);

  try {
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        shippingAddress: true,
        product: true,
        orders: {
          where: {
            isCompleted: true,
          },
          include: {
            product: true,
            configuration: true,
            shippingAddress: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    console.log("Database query result:", user);
    if (!user) {
      console.log("User not found!");
      return notFound();
    }
    console.log("Returning user data:", {
      id: user.id,
      email: user.email,
      shippingAddress: user.shippingAddress,
    });
    return <UserClient user={user} />;
  } catch (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Error loading customer data.
      </div>
    );
  }
};

export default UserPage;
