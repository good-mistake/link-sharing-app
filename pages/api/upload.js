import connectDB from "../../utils/connectDB.js";
import multer from "multer";
import nc from "next-connect";
import { MongoClient, GridFSBucket } from "mongodb";
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc()
  .use(upload.single("image"))
  .post(async (req, res) => {
    await connectDB();

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const client = await MongoClient.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();

      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", () => {
        const imageUrl = `${process.env.MONGO_URI}/uploads/${uploadStream.id}`;
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
