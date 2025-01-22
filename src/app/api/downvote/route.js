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
      return new Response(
        JSON.stringify({ error: "Invalid input data." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userEmail: true },
    });

    if (!post) {
      return new Response(
        JSON.stringify({ error: "Post not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const postOwnerEmail = post.userEmail;

    const existingVote = await prisma.vote.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingVote && existingVote.type === "downvote") {
      return new Response(
        JSON.stringify({ error: "You already downvoted this post." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const voteData = {
      postId,
      userId,
      type: "downvote",
    };

    if (existingVote) {
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: voteData,
      });
    } else {
      await prisma.vote.create({ data: voteData });
    }

    if (userId !== postOwnerEmail) {
     

      const notification= await prisma.notification.create({
          data: {
            type: "vote",
            message: `${userId} downvoted your post.`,
            userId: postOwnerEmail,
            relatedId: postId,
            
          },
        });
      console.log(notification.id)

      await pusher.trigger(`notifications-${postOwnerEmail}`, "new-notification", {
        message: `${userId} downvoted your post.`,
        relatedId: postId,
        id:notification.id

      });
    }

    await pusher.trigger("votes-channel", "voteUpdated", voteData);

    return new Response(
      JSON.stringify({ message: "Downvote processed." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during downvote:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process downvote." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
