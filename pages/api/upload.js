import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } }; // Disable default body parser

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public/uploads"); // Save files locally
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing the file" });

    if (!files.file)
      return res.status(400).json({ error: "No image uploaded" });

    const oldPath = files.file.filepath;
    const newPath = path.join(form.uploadDir, files.file.originalFilename);

    // Move file to correct path
    fs.rename(oldPath, newPath, (err) => {
      if (err) return res.status(500).json({ error: "File move error" });

      res
        .status(200)
        .json({
          message: "File uploaded successfully",
          fileUrl: `/uploads/${files.file.originalFilename}`,
        });
    });
  });
}
