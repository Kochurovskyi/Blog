require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts-routes");
const userRoutes = require("./routes/user-routes");
const predictRoutes = require("./routes/predict-routes");
const translateRoutes = require("./routes/translate-routes");
const HttpError = require("./model/http-error");
const cors = require("cors");
const generateImage = require("./controllers/image-gen-controller");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
app.use("/api", predictRoutes);
app.use("/api", translateRoutes);
app.post("/api/generate-image", generateImage);
app.use("/static", express.static("static"));

app.use((req, res, next) => {
  const error = new HttpError("Could Not Find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

console.log("<<<Server is running on port 8080>>>");
// app.listen(5000);
app.listen(8080);
