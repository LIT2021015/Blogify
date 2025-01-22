import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params; // email could be undefined

  try {
    let personalizedPosts = [];
    let generalPosts = [];

    // If the user is logged in (email is defined)
    if (email) {
      // Fetch posts from people the user follows
      const followingUsers = await prisma.follower.findMany({
        where: { followerId: email },
      });
      const followingEmails = followingUsers.map((user) => user.followingId);

      const followingPosts = await prisma.post.findMany({
        where: { userEmail: { in: followingEmails } },
        include: { user: true, votes: true },
      });

      // Fetch posts by authors the user has upvoted
      const upvotedVotes = await prisma.vote.findMany({
        where: { userId: email, type: "upvote" },
        include: { post: { include: { user: true, votes: true } } },
      });

      const upvotedAuthors = Array.from(
        new Set(upvotedVotes.map((vote) => vote.post.userEmail))
      );
      const authorPosts = await prisma.post.findMany({
        where: { userEmail: { in: upvotedAuthors, not: email } },
        include: { user: true, votes: true },
      });

      // Fetch posts from categories the user has upvoted
      const upvotedCategories = Array.from(
        new Set(upvotedVotes.map((vote) => vote.post.catSlug))
      );
      const categoryPosts = await prisma.post.findMany({
        where: { catSlug: { in: upvotedCategories }, userEmail: { not: email } },
        include: { user: true, votes: true },
      });

      // Combine personalized posts
      personalizedPosts = [...followingPosts, ...authorPosts, ...categoryPosts];

      // Remove duplicates based on post ID
      personalizedPosts = Array.from(new Map(personalizedPosts.map((post) => [post.id, post])).values());

      // Sort personalized posts by rank (upvotes, views, etc.)
      personalizedPosts.sort((a, b) => {
        const upvotesA = a.votes.filter((vote) => vote.type === "upvote").length;
        const upvotesB = b.votes.filter((vote) => vote.type === "upvote").length;

        const rankA = new Date(a.createdAt).getTime() * 0.5 + upvotesA * 0.3 - a.views * 0.2;
        const rankB = new Date(b.createdAt).getTime() * 0.5 + upvotesB * 0.3 - b.views * 0.2;

        return rankB - rankA; // Sort in descending order of rank
      });
    }

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
