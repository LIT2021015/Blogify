import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params; // email could be undefined

  try {
    let personalizedPosts = [];
    let generalPosts = [];

    if (email) {
      const followingUsers = await prisma.follower.findMany({
        where: { followerId: email },
      });
      const followingEmails = followingUsers.map((user) => user.followingId);

      const followingPosts = await prisma.post.findMany({
        where: { userEmail: { in: followingEmails } },
        include: { user: true, votes: true },
      });

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

      const upvotedCategories = Array.from(
        new Set(upvotedVotes.map((vote) => vote.post.catSlug))
      );
      const categoryPosts = await prisma.post.findMany({
        where: { catSlug: { in: upvotedCategories }, userEmail: { not: email } },
        include: { user: true, votes: true },
      });

      personalizedPosts = [...followingPosts, ...authorPosts, ...categoryPosts];

      personalizedPosts = Array.from(new Map(personalizedPosts.map((post) => [post.id, post])).values());

      personalizedPosts.sort((a, b) => {
        const upvotesA = a.votes.filter((vote) => vote.type === "upvote").length;
        const upvotesB = b.votes.filter((vote) => vote.type === "upvote").length;

        const rankA = new Date(a.createdAt).getTime() * 0.5 + upvotesA * 0.3 - a.views * 0.2;
        const rankB = new Date(b.createdAt).getTime() * 0.5 + upvotesB * 0.3 - b.views * 0.2;

        return rankB - rankA; 
      });
    }

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
