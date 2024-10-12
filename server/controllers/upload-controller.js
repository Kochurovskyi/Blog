const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const HttpError = require("../model/http-error");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

const uploadImage = async (req, res, next) => {
  console.log("-------------->>>: Uploading image...");
  upload(req, res, async (err) => {
    if (err) {
      return next(new HttpError("Image upload failed", 500));
    }

    if (!req.file) {
      return next(new HttpError("No file uploaded", 400));
    }

    const { blogID, postID } = req.body;
    const fileName = `${blogID}_${postID}.jpg`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    try {
      const upload = new Upload({
        client: s3Client,
        params: params,
      });

      const data = await upload.done();
      res.status(201).json({ imageUrl: data.Location });
    } catch (err) {
      return next(new HttpError("Image upload to S3 failed", 500));
    }
  });
};

module.exports = { uploadImage };
