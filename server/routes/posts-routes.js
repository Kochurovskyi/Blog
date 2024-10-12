const express = require("express");
const multer = require("multer");
const postControllers = require("../controllers/posts-controllers");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/blog/:bid", postControllers.getPostsByBlogId);
router.get("/:bid/:pid", postControllers.getPostById);
router.post("/", upload.single("image"), postControllers.createPost);
router.patch(
  "/:bid/:pid",
  upload.single("image"),
  postControllers.updatePostById
);
router.delete("/:bid/:pid", postControllers.deletePostById);

module.exports = router;
