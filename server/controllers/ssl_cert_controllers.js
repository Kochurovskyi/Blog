const fs = require("fs");
const path = require("path");
const HttpError = require("../model/http-error");

const getSSLCert = (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "../457E1F4D6143CADF438A583DBF45706B.txt"
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Could not read the file", 500));
    }
    res.send(data);
  });
};

module.exports = { getSSLCert };
