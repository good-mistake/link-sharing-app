import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MognoDB Connected!");
  } catch (e) {
    console.error("MongoDB connection error:", e);
    throw new Error("Failed to connect to database");
  }
};
export default connectDB;
