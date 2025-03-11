import prisma from "@/utils/connect";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, userId } = body;

    if (!postId || !userId) {
      return new Response(JSON.stringify({ error: "Invalid input data." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userEmail: true },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const postOwnerEmail = post.userEmail;

    const existingVote = await prisma.vote.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingVote) {
      if (existingVote.type === "upvote") {
        return new Response(
          JSON.stringify({ error: "You already upvoted this post." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: "upvote" },
      });

      if (userId !== postOwnerEmail) {
        
        

        const notification = await prisma.notification.create({
          data: {
            type: "vote",
            message: `${userId} upvoted your post.`,
            userId: postOwnerEmail,
            relatedId: postId,
          },
        });

         console.log(notification.id)
        try {
          await pusher.trigger(
            `notifications-${postOwnerEmail}`,
            "new-notification",
            {
              message: `${userId} upvoted your post.`,
              relatedId: postId,
              id:notification.id
            }
          );
        } catch (pusherError) {
          console.error("Failed to send Pusher notification:", pusherError);
        }
      }

      try {
        await pusher.trigger("votes-channel", "voteUpdated", {
          postId,
          userId,
          type: "upvote",
        });
      } catch (pusherError) {
        console.error("Failed to trigger Pusher vote update:", pusherError);
      }

      return new Response(
        JSON.stringify({ message: "Vote updated to upvote." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.vote.create({
      data: {
        postId,
        userId,
        type: "upvote",
      },
    });

    if (userId !== postOwnerEmail) {
      const notification = await prisma.notification.create({
        data: {
          type: "vote",
          message: `${userId} upvoted your post.`,
          userId: postOwnerEmail,
          relatedId: postId,
        },
      });

      console.log(notification.id)
    
      try {
        await pusher.trigger(
          `notifications-${postOwnerEmail}`,
          "new-notification",
          {
            message: `${userId} upvoted your post.`,
            relatedId: postId,
            id: notification.id,
          }
        );
      } catch (pusherError) {
        console.error("Failed to send Pusher notification:", pusherError);
      }
    }

    
    try {
      await pusher.trigger("votes-channel", "voteUpdated", {
        postId,
        userId,
        type: "upvote",
      });
    } catch (pusherError) {
      console.error("Failed to trigger Pusher vote update:", pusherError);
    }

    return new Response(JSON.stringify({ message: "Upvote added." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during upvote:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upvote the post." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
