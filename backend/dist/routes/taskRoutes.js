"use strict";

var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
var _require = require("../controllers/taskController"),
  updateTask = _require.updateTask,
  createTask = _require.createTask,
  getTasks = _require.getTasks,
  getTaskById = _require.getTaskById,
  deleteTask = _require.deleteTask;

// ✅ Configure Multer for File Uploads
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/"); // Store files in the "uploads" directory
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
var upload = multer({
  storage: storage
});

// ✅ Define Routes
router.post("/", upload.single("file"), createTask); // Create Task with file upload
router.get("/", getTasks); // Get all tasks
router.get("/:id", getTaskById); // Get a specific task
router.put("/:id", upload.single("file"), updateTask); // Update Task (supports file update)
router["delete"]("/:id", deleteTask); // Delete Task

module.exports = router;