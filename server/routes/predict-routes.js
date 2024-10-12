const express = require("express");
const predictControllers = require("../controllers/predict-controllers");
const router = express.Router();

router.post("/predict", predictControllers.predict);

module.exports = router;
