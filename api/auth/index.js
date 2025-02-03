import connectDB from "../../utils/connectDB";
import User from "../../model/User";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens";
import sendVerificationEmail from "../../utils/emailSender";

const authHandler = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { accountEmail, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        accountEmail,
        password: hashedPassword,
      });

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);
      newUser.refreshToken = refreshToken;

      await sendVerificationEmail(accountEmail, accessToken);
      console.log("Request Body:", req.body);

      return res.status(201).json({
        message: "User registered. Please verify your email!",
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to register user." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default authHandler;
