import connectDB from "../../utils/connectDB.js";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Method Not Allowed" });
  },
});

apiRoute.use(upload.single("image"));

apiRoute.post(async (req, res) => {
  await connectDB();

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res
      .status(200)
      .json({ imageUrl: "https://your-storage.com/uploaded-image.jpg" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
