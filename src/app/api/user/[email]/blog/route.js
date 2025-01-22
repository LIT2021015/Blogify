import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params;

  try {
    const blogs = await prisma.post.findMany({
      where: { userEmail: email },
      select: {
        id: true,
        title: true,
        desc: true,
        img: true,
        createdAt: true,
        views: true,
        votes: {
          select: {
            type: true,
          },
        },
      },
    });

    const blogsWithVoteCounts = blogs.map((blog) => ({
      ...blog,
      upvotes: blog.votes.filter((vote) => vote.type === "up").length,
      downvotes: blog.votes.filter((vote) => vote.type === "down").length,
    }));

    return new Response(JSON.stringify(blogsWithVoteCounts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
