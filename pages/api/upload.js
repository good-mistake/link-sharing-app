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
    bodyParser: false, // Required to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form Parsing Error:", err);
      return res.status(400).json({ error: "Form parsing error" });
    }

    console.log("Fields:", fields); // Debugging line to check form fields
    console.log("Files:", files); // Debugging line to check uploaded files

    const file = files.image?.[0]; // Get first file
    if (!file) {
      console.log("No image uploaded"); // Debugging
      return res.status(400).json({ error: "No image uploaded" });
    }

    try {
      const fileData = await fs.readFile(file.filepath);
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ error: "Upload failed" });
          }
          console.log("Cloudinary Upload Success:", result);
          return res.status(200).json({ imageUrl: result.secure_url });
        }
      );
      uploadStream.end(fileData); // Send file data to Cloudinary
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  });
}
