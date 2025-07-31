import { db } from "@repo/database";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import UsersClient from "./users-client";
import { toast } from "sonner";

const Users = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    toast.error("User not found")
    return notFound();
  }
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    toast.error("User not authorized, redirecting to 404")
    return notFound();
  }
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        shippingAddress: {
          select: {
            fullName: true,
            phoneNumber: true,
            address: true,
          },
        },
        orders: {
          select: {
            isCompleted: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(
      "Found users:",
      users.map((u) => ({
        id: u.id,
        email: u.email,
      })),
    );
    return (
      <div>
        <UsersClient users={users} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading customers</div>;
  }
};

export default Users;
