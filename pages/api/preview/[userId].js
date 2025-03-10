import User from "../../../model/User.js";
import connectDB from "../../../utils/connectDB.js";
export async function GET(req, { params }) {
  await connectDB();

  const { userId } = params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ profile: user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
