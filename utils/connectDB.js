import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

export default connectDB;
