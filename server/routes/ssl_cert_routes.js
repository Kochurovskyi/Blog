const express = require("express");
const { getSSLCert } = require("../controllers/ssl_cert_controllers");
const router = express.Router();

router.get(
  "/.well-known/pki-validation/457E1F4D6143CADF438A583DBF45706B.txt",
  getSSLCert
);

module.exports = router;
