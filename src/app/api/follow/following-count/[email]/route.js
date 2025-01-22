import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params;

  try {
    const count = await prisma.follower.count({
      where: {
        followerId: email,
      },
    });

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching following count" }), { status: 500 });
  }
}
