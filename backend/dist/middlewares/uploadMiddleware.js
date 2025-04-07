"use strict";

var multer = require("multer");
var path = require("path");

// ✅ Define Storage Configuration
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/"); // Save files in 'uploads/' directory
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// ✅ File Upload Middleware
var upload = multer({
  storage: storage
});
module.exports = upload;