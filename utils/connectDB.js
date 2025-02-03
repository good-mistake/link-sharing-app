import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(
      "mongodb+srv://admin:lwqrOHulLo3c6XCE@link-sharing-app-cluste.adnhv.mongodb.net/?retryWrites=true&w=majority&appName=link-sharing-app-cluster",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MognoDB Connected!");
  } catch (e) {
    console.error("MongoDB connection error:", e);
    throw new Error("Failed to connect to database");
  }
};
export default connectDB;
