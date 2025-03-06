import fs from "fs";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    // Example: Read image file
    const imageFile = files.profileImg;
    if (!imageFile) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Simulate saving file (Modify this to your storage logic)
    const filePath = `./public/uploads/${imageFile.newFilename}`;
    fs.renameSync(imageFile.filepath, filePath);

    res.status(200).json({ message: "Profile updated successfully", filePath });
  });
}
