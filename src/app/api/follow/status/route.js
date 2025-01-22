import prisma from "@/utils/connect";

export async function POST(req) {
  const { followerEmail, followingEmail } = await req.json();

  try {
    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: followingEmail,
        },
      },
    });

    return new Response(
      JSON.stringify({ isFollowing: follow !== null }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error checking follow status" }), { status: 500 });
  }
}
