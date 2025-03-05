import cloudinary from "cloudinary";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";

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

  const form = new IncomingForm({ keepExtensions: true });

  try {
    const [, files] = await form.parse(req);
    const file = files.image?.[0];

    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const fileData = await fs.readFile(file.filepath);

    const uploadResponse = await cloudinary.v2.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Upload failed" });
        }
        return res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    uploadResponse.end(fileData); // Send file data to Cloudinary
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
