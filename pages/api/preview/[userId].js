import User from "../../../model/User.js";
import connectDB from "../../../utils/connectDB.js";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ profile: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
