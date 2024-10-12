const express = require("express");
const translateControllers = require("../controllers/translate-controllers");
const router = express.Router();

router.post("/translate", translateControllers.translateText);

module.exports = router;
