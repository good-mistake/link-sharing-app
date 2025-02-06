import connectDB from "../../../utils/connectDB.js";
import User from "../../../model/User";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const { userId } = req.query;

  switch (method) {
    case "GET":
      try {
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
          user.links = links;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated", profile: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
      }
      break;

    case "POST":
      try {
        const { url, platform } = req.body;
        if (!url || !platform)
          return res
            .status(400)
            .json({ error: "URL and platform are required" });

        const user = await user.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.links.push({ url, platform });
        await user.save();

        res.status(201).json({ message: "Link added", profile: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add link" });
      }
      break;

    case "DELETE":
      try {
        const { linkId } = req.body;

        if (linkId) {
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ error: "User not found" });

          user.links = user.links.filter(
            (link) => link._id.toString() !== linkId
          );
          await user.save();
          res.status(200).json({ message: "Link deleted", profile: user });
        } else {
          await User.findByIdAndDelete(userId);
          res.status(200).json({ message: "Profile deleted" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
