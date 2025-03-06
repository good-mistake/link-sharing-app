import formidable from "formidable";
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parsing error" });
    }

    const { firstName, lastName, profileEmail } = fields;
    const file = files.profileImg;

    // **Check if all fields are present**
    if (!firstName || !lastName || !profileEmail || !file) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(
        file.filepath,
        {
          folder: "uploads",
        }
      );

      fs.unlinkSync(file.filepath);

      return res.status(200).json({
        message: "Profile updated successfully.",
        imageUrl: uploadResponse.secure_url,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Image upload failed." });
    }
  });
}
