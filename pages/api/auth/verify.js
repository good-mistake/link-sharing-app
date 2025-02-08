import jwt from "jsonwebtoken";
import User from "../../../model/User.js";
import connectDB from "../../../utils/connectDB.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.redirect("/verification-failed?error=Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect("/verification-failed?error=User not found");
    }

    if (user.isVerified) {
      return res.redirect(302, "/verified-success");
    }

    user.isVerified = true;
    await user.save();

    return res.redirect(302, "/verified-success");
  } catch (err) {
    console.error("Verification Error:", err);

    let errorMessage = "Invalid or expired token.";
    if (err.name === "TokenExpiredError") {
      errorMessage = "Verification link has expired.";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Invalid token.";
    }
    return res.redirect(
      `/verification-failed?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
