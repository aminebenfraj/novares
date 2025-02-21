const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { updateTask, createTask, getTasks, getTaskById, deleteTask } = require("../controllers/taskController");

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ Define Routes
router.post("/", upload.single("file"),createTask); // Create Task with file upload
router.get("/",getTasks); // Get all tasks
router.get("/:id",getTaskById); // Get a specific task
router.put("/:id", upload.single("file"),updateTask); // Update Task (supports file update)
router.delete("/:id",deleteTask); // Delete Task

module.exports = router;
