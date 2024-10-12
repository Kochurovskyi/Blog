const express = require("express");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();
router.post("/login", usersControllers.login);
module.exports = router;
