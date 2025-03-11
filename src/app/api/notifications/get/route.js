import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const session = await getAuthSession(req);



  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const  userId  = session?.user?.email;

  console.log(userId)

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false, 
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
};
