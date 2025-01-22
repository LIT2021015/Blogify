import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const postSlug = searchParams.get("postSlug");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
      include: { user: true },
    });
    //  console.log(comments);
    return new NextResponse(JSON.stringify(comments, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const comment = await prisma.comment.create({
      data: { ...body, userEmail: session.user.email },
    });
    console.log(body)

    const post = await prisma.post.findUnique({
      where: { slug: body.postSlug },
      select: { userEmail: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, { status: 404 })
      );
    }

    const postOwnerEmail = post.userEmail;

    console.log(postOwnerEmail)

    if (session.user.email !== postOwnerEmail) {
      const notification = await prisma.notification.create({
        data: {
          type: "comment",
          message: `${session.user.email} commented on your post.`,
          userId: postOwnerEmail,
          relatedId: comment.id,
          
        },
      });

      console.log("Notification created:", notification.id);

      // Trigger real-time notification via Pusher
      await pusher.trigger(
        `notifications-${postOwnerEmail}`,
        "new-notification",
        {
          message: `${session.user.email} commented on your post.`,
          relatedId: comment.id,
          id: notification.id,
        }
      );
    }
    await pusher.trigger(`comments-${body.postSlug}`, "new-comment", {
      comment,
    });

    return new NextResponse(JSON.stringify(comment, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
