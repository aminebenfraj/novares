const express = require("express");
const router = express.Router();
const {
  showUserInfo,
  updateUserRole,
  updateCurrentUser,
  deleteCurrentUser
} = require("../controllers/userController");

// 🔹 Middleware for authentication (implement JWT or session-based auth)
const protect = require("../middlewares/authMiddlewar"); // Example authentication middleware
const isAdmin = require("../middlewares/adminMiddleware"); // Example admin middleware

// 🔹 Routes
router.get("/profile", protect, showUserInfo); 
router.put("/update", protect, updateCurrentUser); 
router.put("/role/:lisence", protect, isAdmin, updateUserRole); // Update user role (Admin)
router.delete("/delete", protect, deleteCurrentUser); 

module.exports = router;
