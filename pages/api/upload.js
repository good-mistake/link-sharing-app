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
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(500).json({ error: "File upload error" });
    }

    if (!files.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const filePath = files.file.filepath;

    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(filePath, {
        folder: "uploads",
      });

      fs.unlinkSync(filePath);

      res.status(200).json({ imageUrl: uploadResponse.secure_url });
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
