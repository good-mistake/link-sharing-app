import connectDB from "../../../utils/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import sendVerificationEmail from "../../../utils/emailSender";

export default async function handler(req, res) {
  console.log("🔄 Received request:", req.method, req.url);

  if (req.method !== "POST") {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("🔄 Connecting to DB...");
  await connectDB();
  console.log("✅ Database connected.");

  const { accountEmail, password } = req.body;
  console.log("📩 Received request body:", { accountEmail });

  if (!accountEmail || !password) {
    console.error("❌ Missing required fields");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    console.log("🔍 Checking if user exists...");
    const existingUser = await User.findOne({ accountEmail });

    if (existingUser) {
      console.error("❌ User already exists:", accountEmail);
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🆕 Creating new user...");
    const newUser = new User({
      accountEmail,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();
    console.log("✅ User created successfully:", newUser._id);

    console.log("📩 Sending verification email...");
    const token = jwt.sign(
      { id: newUser._id, email: newUser.accountEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(newUser.accountEmail, token);
    console.log("✅ Verification email sent to:", newUser.accountEmail);

    return res
      .status(201)
      .json({ message: "User registered. Please verify your email!" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
}
