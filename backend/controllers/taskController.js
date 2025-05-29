const Task = require("../models/Task");
const User = require("../models/UserModel"); // ✅ ADD THIS IMPORT
const path = require("path");
const fs = require("fs");

// Helper function to sanitize file paths
const sanitizeFilePath = (filePath) => {
  return path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
};

// Helper function to delete file with error handling
const deleteFile = (filePath) => {
  try {
    if (filePath) {
      const sanitizedPath = path.join(__dirname, "..", sanitizeFilePath(filePath));
      if (fs.existsSync(sanitizedPath)) {
        fs.unlinkSync(sanitizedPath);
      }
    }
  } catch (err) {
    console.error("Failed to delete file:", err);
    throw err;
  }
};

// Create a new task with file upload
exports.createTask = async (req, res) => {
  try {
    const { check, role, assignedUsers, planned, done, comments } = req.body;
    const uploadPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (assignedUsers && !Array.isArray(assignedUsers)) {
      return res.status(400).json({ message: "assignedUsers must be an array" });
    }

    const newTask = new Task({
      check,
      role,
      assignedUsers,
      planned,
      done,
      comments,
      filePath: uploadPath,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", data: newTask });
  } catch (error) {
    // Clean up uploaded file if task creation fails
    if (req.file) {
      deleteFile(`/uploads/${req.file.filename}`);
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tasks with pagination
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find().skip(skip).limit(limit);
    const total = await Task.countDocuments();

    res.status(200).json({
      data: tasks,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a task (supports file update)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { check, role, assignedUsers, planned, done, comments } = req.body;
    const uploadPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Delete old file if new file is uploaded
    if (uploadPath && task.filePath) {
      deleteFile(task.filePath);
    }

    const updateData = {};
    if (check !== undefined) updateData.check = check;
    if (role !== undefined) updateData.role = role;
    if (assignedUsers !== undefined) {
      if (!Array.isArray(assignedUsers)) {
        return res.status(400).json({ message: "assignedUsers must be an array" });
      }
      updateData.assignedUsers = assignedUsers;
    }
    if (planned !== undefined) updateData.planned = planned;
    if (done !== undefined) updateData.done = done;
    if (comments !== undefined) updateData.comments = comments;
    if (uploadPath) updateData.filePath = uploadPath;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file) {
      deleteFile(`/uploads/${req.file.filename}`);
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a task and remove uploaded file
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete the associated file if it exists
    if (task.filePath) {
      deleteFile(task.filePath);
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all available roles (from the Task model schema)
exports.getAvailableRoles = async (req, res) => {
  try {
    const roles = Task.schema.path('role').enumValues;
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ FIXED: Get users by role (handles multiple roles per user)
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Find users who have this role in their roles array
    const users = await User.find({ 
      roles: { $in: [role] } // ✅ Search in roles array
    }).select('_id username email roles');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};