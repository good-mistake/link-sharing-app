import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  accountEmail: { type: String, required: true, unique: true },
  profileEmail: { type: String, required: false },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  profilePicture: { type: String },
  links: [
    {
      url: { type: String, required: true },
      platform: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      color: { type: String },
    },
  ],
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
