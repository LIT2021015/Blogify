import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { email } = params;

  try {
    const count = await prisma.follower.count({
      where: {
        followingId: email,
      },
    });

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching followers count" }), { status: 500 });
  }
}
