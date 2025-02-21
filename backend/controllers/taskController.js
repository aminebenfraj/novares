const Task = require("../models/Task");
const path = require("path");
const fs = require("fs");

// ✅ Create a new task with file upload
exports.createTask = async (req, res) => {
  try {
    const { check, responsible, planned, done, comments } = req.body;
    const uploadPath = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

    const newTask = new Task({
      check,
      responsible,
      planned,
      done,
      comments,
      filePath: uploadPath,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", data: newTask });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a task (supports file update)
exports.updateTask = async (req, res) => {
  try {
    const { check, responsible, planned, done, comments } = req.body;
    const uploadPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {};
    if (check !== undefined) updateData.check = check;
    if (responsible !== undefined) updateData.responsible = responsible;
    if (planned !== undefined) updateData.planned = planned;
    if (done !== undefined) updateData.done = done;
    if (comments !== undefined) updateData.comments = comments;
    if (uploadPath) updateData.filePath = uploadPath;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", data: updatedTask });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a task and remove uploaded file
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete the associated file if it exists
    if (task.filePath) {
      const filePath = path.join(__dirname, "..", task.filePath);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
