import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = "/tmp"; // Temporary storage for Vercel
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing file:", err);
        return res.status(500).json({ error: "Error parsing the file" });
      }

      if (!files.file) {
        console.log("No file uploaded:", files);
        return res.status(400).json({ error: "No image uploaded" });
      }

      // Read file data
      const file = files.file[0]; // Ensure file is properly referenced
      const tempPath = file.filepath;
      const fileData = fs.readFileSync(tempPath);

      // Convert to Base64 if needed (for database storage)
      const base64Image = `data:${file.mimetype};base64,${fileData.toString(
        "base64"
      )}`;

      res
        .status(200)
        .json({ message: "File uploaded successfully", image: base64Image });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
