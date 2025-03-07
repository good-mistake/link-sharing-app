import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new formidable.IncomingForm();
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
      console.log("Uploaded file:", file);

      const tempPath = file.filepath || file.path;
      const fileData = fs.readFileSync(tempPath);
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
