const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const okForLunchController = require("../controllers/okForLunchController");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("upload"), okForLunchController.createOkForLunch);
router.get("/", okForLunchController.getAllOkForLunch);
router.get("/:id", okForLunchController.getOkForLunchById);
router.put("/:id", upload.single("upload"), okForLunchController.updateOkForLunch);
router.delete("/:id", okForLunchController.deleteOkForLunch);

module.exports = router;
