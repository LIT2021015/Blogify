import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  // Get the session from the request
  const session = await getAuthSession(req);

  // If no session exists, return unauthorized response
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get the userId from the session
  const { userId } = session;

  // Parse the request body to get notificationId
  const { notificationId } = await req.json();

  try {
    // Find the notification to mark it as read
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    // Return success message
    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ message: "Failed to mark notification as read" }, { status: 500 });
  }
};
