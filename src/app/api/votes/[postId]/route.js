import prisma from "@/utils/connect";

export async function GET(req, { params }) {
    const { postId } = params; 
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); 
  
    if (!userId) {
      return new Response(JSON.stringify({ message: "User is not authenticated." }), { status: 401 });
    }
  
    try {
      const voteData = await prisma.vote.findMany({
        where: { postId },
        select: {
          type: true,
          userId: true, 
        },
      });
  
      const upvotes = voteData.filter(vote => vote.type === "upvote").length;
      const downvotes = voteData.filter(vote => vote.type === "downvote").length;
  
      const userVote = voteData.find(vote => vote.userId === userId)?.type || null;
  
      return new Response(
        JSON.stringify({
          upvotes,
          downvotes,
          userVote, 
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching vote data:", error);
      return new Response(JSON.stringify({ message: "Error fetching vote data" }), { status: 500 });
    }
  }