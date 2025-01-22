import prisma from "@/utils/connect";

export async function GET(req, ) {
  
     let email=""
  try {
    let personalizedPosts = [];
    let generalPosts = [];



    // Fetch general popular posts (exclude current user's posts if logged in)
    generalPosts = await prisma.post.findMany({
      where: { userEmail: { not: email } }, // Exclude current user's posts
      include: { user: true, votes: true },
      orderBy: [
        { views: "desc" }, // Order by most views
        { createdAt: "desc" }, // Order by latest posts if views are equal
      ],
      take: 50, // Limit the number of popular posts
    });

    // Remove any general posts that are already included in personalized posts
    const generalPostsWithoutPersonalized = generalPosts.filter(
      (generalPost) =>
        !personalizedPosts.some((personalizedPost) => personalizedPost.id === generalPost.id)
    );

    // Sort general posts by rank (upvotes, views, etc.)
    generalPostsWithoutPersonalized.sort((a, b) => {
      const upvotesA = a.votes.filter((vote) => vote.type === "upvote").length;
      const upvotesB = b.votes.filter((vote) => vote.type === "upvote").length;

      const rankA = new Date(a.createdAt).getTime() * 0.5 + upvotesA * 0.3 - a.views * 0.2;
      const rankB = new Date(b.createdAt).getTime() * 0.5 + upvotesB * 0.3 - b.views * 0.2;

      return rankB - rankA; // Sort in descending order of rank
    });

    // Combine personalized posts first, followed by general posts
    const allPosts = [...personalizedPosts, ...generalPostsWithoutPersonalized];

    return new Response(JSON.stringify(allPosts), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating feed:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}
