const express = require("express");
const { uploadImage } = require("../controllers/upload-controller");
const router = express.Router();

router.post("/upload", uploadImage);

module.exports = router;
