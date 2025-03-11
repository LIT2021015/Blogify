import prisma from "@/utils/connect";

export async function GET(req, ) {
  
     let email=""
  try {
    let personalizedPosts = [];
    let generalPosts = [];



    generalPosts = await prisma.post.findMany({
      where: { userEmail: { not: email } },
      include: { user: true, votes: true },
      orderBy: [
        { views: "desc" }, 
        { createdAt: "desc" }, 
      ],
      take: 50, 
    });

    const generalPostsWithoutPersonalized = generalPosts.filter(
      (generalPost) =>
        !personalizedPosts.some((personalizedPost) => personalizedPost.id === generalPost.id)
    );

    generalPostsWithoutPersonalized.sort((a, b) => {
      const upvotesA = a.votes.filter((vote) => vote.type === "upvote").length;
      const upvotesB = b.votes.filter((vote) => vote.type === "upvote").length;

      const rankA = new Date(a.createdAt).getTime() * 0.5 + upvotesA * 0.3 - a.views * 0.2;
      const rankB = new Date(b.createdAt).getTime() * 0.5 + upvotesB * 0.3 - b.views * 0.2;

      return rankB - rankA; 
    });

    const allPosts = [...personalizedPosts, ...generalPostsWithoutPersonalized];

    return new Response(JSON.stringify(allPosts), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating feed:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}
