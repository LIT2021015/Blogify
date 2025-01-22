import prisma from "@/utils/connect";

export async function POST(req) {
  const { followerEmail, followingEmail } = await req.json();

  try {
    // Check if the user is already following
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: followingEmail,
        },
      },
    });

    if (existingFollow) {
      // If already following, unfollow
      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId: followerEmail,
            followingId: followingEmail,
          },
        },
      });
      return new Response(JSON.stringify({ message: "Unfollowed successfully" }), { status: 200 });
    } else {
      // If not following, follow the user
      await prisma.follower.create({
        data: {
          followerId: followerEmail,
          followingId: followingEmail,
        },
      });
      return new Response(JSON.stringify({ message: "Followed successfully" }), { status: 201 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error following/unfollowing user" }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { followerEmail, followingEmail } = await req.json();

  try {
    
    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: followingEmail,
        },
      },
    });
    return new Response(JSON.stringify({ message: "Unfollowed successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error unfollowing user" }), { status: 500 });
  }
}
