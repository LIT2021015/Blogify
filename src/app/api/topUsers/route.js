import prisma from "@/utils/connect";
export async function GET(req) {
  try {
    const users = await prisma.user.findMany({
      include: {
        Post: {
          include: {
            votes: true,
          },
        },
      },
    });

    
    const sortedUsers = users
      .map((user) => {
        const totalUpvotes = user.Post.reduce(
          (sum, post) => sum + post.votes.filter((vote) => vote.type === "upvote").length,
          0
        );
        const totalViews = user.Post.reduce((sum, post) => sum + post.views, 0);
        const totalPosts = user.Post.length;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          totalUpvotes,
          totalViews,
          totalPosts,
          score: totalUpvotes * 3 + totalViews * 2 + totalPosts * 1, 
        };
      })
      .sort((a, b) => b.score - a.score); 

    return new Response(JSON.stringify(sortedUsers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
