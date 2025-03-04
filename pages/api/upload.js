import { MongoClient, GridFSBucket } from "mongodb";
import multer from "multer";
import nc from "next-connect";
import connectDB from "../../utils/connectDB";

const upload = multer({ storage: multer.memoryStorage() });
const handler = nc();

handler.use(upload.single("image"));

handler.post(async (req, res) => {
  await connectDB();
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      const imageUrl = `/api/uploads/${uploadStream.id}`;
      res.status(200).json({ imageUrl });
    });

    uploadStream.on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to upload file" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default handler;
