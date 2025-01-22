import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    let body;

    // Parse the body based on the content type
    const contentType = req.headers.get("content-type");
    if (contentType === "application/json") {
      body = await req.json();
    } else if (contentType === "application/x-www-form-urlencoded") {
      const text = await req.text();
      body = Object.fromEntries(new URLSearchParams(text));
    } else {
      throw new Error("Unsupported Content-Type");
    }

    const { socket_id, channel_name } = body;

    const authResponse = pusher.authorizeChannel(socket_id, channel_name);

    return new Response(JSON.stringify(authResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error authenticating Pusher:", error);

    return new Response(
      JSON.stringify({ error: "Failed to authenticate with Pusher" }),
      { status: 403 }
    );
  }
}
