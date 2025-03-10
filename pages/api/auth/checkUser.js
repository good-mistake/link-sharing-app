import connectDB from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await User.findOne({ accountEmail: email });

    return res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
