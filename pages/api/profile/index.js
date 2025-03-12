import connectDB from "../../../utils/connectDB.js";
import User from "../../../model/User.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    let userId;

    // If the request method is GET, allow public access to view profile
    if (method === "GET") {
      const { id } = req.query; // For public profile access
      userId = id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({ profile: user });
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;

    switch (method) {
      case "PUT":
        const { firstName, lastName, profileEmail, profilePicture, links } =
          req.body;
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate)
          return res.status(404).json({ error: "User not found" });

        if (firstName) userToUpdate.firstName = firstName;
        if (lastName) userToUpdate.lastName = lastName;
        if (profileEmail) userToUpdate.profileEmail = profileEmail;
        if (profilePicture) userToUpdate.profilePicture = profilePicture;
        if (links)
          userToUpdate.links = links.map((link) => ({
            url: link.url,
            platform: link.platform,
            color: link.color || "#000",
          }));

        await userToUpdate.save();
        return res
          .status(200)
          .json({ message: "Profile updated", profile: userToUpdate });

      case "POST":
        const { url, platform, color } = req.body;
        if (!url || !platform)
          return res
            .status(400)
            .json({ error: "URL and platform are required" });

        const userToAddLink = await User.findById(userId);
        if (!userToAddLink)
          return res.status(404).json({ error: "User not found" });

        userToAddLink.links.push({ url, platform, color });
        await userToAddLink.save();
        return res
          .status(201)
          .json({ message: "Link added", profile: userToAddLink });

      case "DELETE":
        const { linkId, deleteProfile } = req.body;
        const userToDeleteFrom = await User.findById(userId);
        if (!userToDeleteFrom)
          return res.status(404).json({ error: "User not found" });

        if (linkId) {
          userToDeleteFrom.links = userToDeleteFrom.links.filter(
            (link) => link._id.toString() !== linkId
          );
          await userToDeleteFrom.save();
          return res
            .status(200)
            .json({ message: "Link deleted", profile: userToDeleteFrom });
        }

        if (deleteProfile) {
          await User.findByIdAndDelete(userId);
          return res.status(200).json({ message: "Profile deleted" });
        }

        return res.status(400).json({ error: "Invalid delete request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
