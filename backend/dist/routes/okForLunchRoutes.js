"use strict";

var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
var _require = require("../controllers/okForLunchController"),
  createOkForLunch = _require.createOkForLunch,
  getAllOkForLunch = _require.getAllOkForLunch,
  getOkForLunchById = _require.getOkForLunchById,
  updateOkForLunch = _require.updateOkForLunch,
  deleteOkForLunch = _require.deleteOkForLunch;

// Configure Multer for file uploads
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/"); // Save files in "uploads" directory
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
var upload = multer({
  storage: storage
});

// Routes
router.post("/", upload.single("upload"), createOkForLunch);
router.get("/", getAllOkForLunch);
router.get("/:id", getOkForLunchById);
router.put("/:id", upload.single("upload"), updateOkForLunch);
router["delete"]("/:id", deleteOkForLunch);
module.exports = router;