import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Ensure you're handling the file field correctly
    const { file } = req.body; // Ensure the field name matches the one used in formData.append

    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(file, {
      folder: "uploads",
    });

    res.status(200).json({ imageUrl: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
}
