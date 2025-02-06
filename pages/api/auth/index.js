import connectDB from "../../../utils/connectDB.js";
import User from "../../../model/User";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/generateTokens";
import sendVerificationEmail from "../../../utils/emailSender";

const authHandler = async (req, res) => {
  await connectDB();
  console.log("Request received:", req.method, req.url);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  console.log("MONGO_URL:", process.env.MONGO_URL ? "Loaded" : "Not Defined");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { accountEmail, password } = req.body;

    if (!accountEmail || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ accountEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      accountEmail,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    await sendVerificationEmail(accountEmail, accessToken);
    console.log("Request Body:", req.body);

    return res.status(201).json({
      message: "User registered. Please verify your email!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Failed to register user." });
  }
};

export default authHandler;
