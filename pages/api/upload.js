import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split("@")[1],
  api_key: process.env.CLOUDINARY_URL.split("/")[2].split(":")[2],
  api_secret: process.env.CLOUDINARY_URL.split(":")[2],
});
console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);

export const config = { api: { bodyParser: false } };
console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);

  try {
    const form = new IncomingForm();
    form.uploadDir = "/tmp";
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing the file" });
      }

      if (!files.file) {
        console.log("No file uploaded:", files);
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = files.file[0];
      const tempPath = file.filepath || file.path;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(tempPath, {
          folder: "user_profiles",
        });

        res.status(200).json({ imageUrl: result.secure_url });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(500).json({ error: "Failed to upload image" });
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
