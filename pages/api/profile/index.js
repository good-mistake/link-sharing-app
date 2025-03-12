import connectDB from "../../../utils/connectDB.js";
import User from "../../../model/User.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    switch (method) {
      case "GET":
        try {
          let userId;
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
          } else {
            const { id } = req.query;
            userId = id;
          }

          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ error: "User not found" });

          res.status(200).json({ profile: user });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Server error" });
        }
        break;

      case "PUT":
        try {
          const { firstName, lastName, profileEmail, profilePicture, links } =
            req.body;
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ error: "User not found" });

          if (firstName) user.firstName = firstName;
          if (lastName) user.lastName = lastName;
          if (profileEmail) user.profileEmail = profileEmail;
          if (profilePicture) user.profilePicture = profilePicture;

          if (links) {
            user.links = links.map((link) => ({
              url: link.url,
              platform: link.platform,
              color: link.color || "#000",
            }));
          }

          await user.save();
          res.status(200).json({ message: "Profile updated", profile: user });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Failed to update profile" });
        }
        break;

      case "POST":
        try {
          const { url, platform, color } = req.body;
          if (!url || !platform)
            return res
              .status(400)
              .json({ error: "URL and platform are required" });

          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ error: "User not found" });

          user.links.push({ url, platform, color });
          await user.save();

          res.status(201).json({ message: "Link added", profile: user });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to add link" });
        }
        break;

      case "DELETE":
        try {
          const { linkId, deleteProfile } = req.body;

          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ error: "User not found" });

          if (linkId) {
            user.links = user.links.filter(
              (link) => link._id.toString() !== linkId
            );
            await user.save();
            return res
              .status(200)
              .json({ message: "Link deleted", profile: user });
          }

          if (deleteProfile) {
            await User.findByIdAndDelete(userId);
            return res.status(200).json({ message: "Profile deleted" });
          }

          return res.status(400).json({ error: "Invalid delete request" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to delete" });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
