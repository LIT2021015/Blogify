import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  // Get the session from the request
  const session = await getAuthSession(req);



  // If no session exists, return unauthorized response
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get the userId from the session
  const  userId  = session?.user?.email;

  console.log(userId)

  try {
    // Fetch unread notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false, // Only fetch unread notifications
      },
      orderBy: {
        createdAt: "desc", // Order by latest
      },
    });

    // Return the notifications
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
};
