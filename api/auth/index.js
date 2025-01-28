import connectDB from "../../utils/connectDB";
import User from "../../model/User";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens";
import sendVerificationEmail from "../../utils/emailSender";

export default async function handler(req, res) {
  await connectDB;

  if (req.method === "POST") {
    const { accountEmail, password, firstName, lastName } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        accountEmail,
        password: hashedPassword,
        firstName,
        lastName,
      });

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      newUser.refreshToken = refreshToken;

      await sendVerificationEmail(accountEmail, accessToken);

      res.status(201).json({
        message: "User registered. Please verify your email!",
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
