import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params;

  try {
    const blogs = await prisma.post.findMany({
      where: { userEmail: email },
      select: {
        views: true,
        votes: {
          select: {
            type: true,
          },
        },
      },
    });

    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);
    const totalUpvotes = blogs.reduce(
      (acc, blog) => acc + blog.votes.filter((vote) => vote.type === "upvote").length,
      0
    );
    const totalDownvotes = blogs.reduce(
      (acc, blog) => acc + blog.votes.filter((vote) => vote.type === "downvote").length,
      0
    );

    return new Response(
      JSON.stringify({
        totalViews,
        totalUpvotes,
        totalDownvotes,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
