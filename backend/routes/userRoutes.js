const express = require("express");
const router = express.Router();
const {
  showUserInfo,
  updateUserRole,
  updateCurrentUser,
  deleteCurrentUser
} = require("../controllers/userController");
const { protect, verifyAdmin } = require("../middlewares/authMiddleware");

// 🔹 Routes
router.get("/profile", protect, showUserInfo); 
router.put("/update", protect, updateCurrentUser); 
router.put("/role/:lisence", protect, verifyAdmin, updateUserRole); // Update user role (Admin)
router.delete("/delete", protect, deleteCurrentUser); 

module.exports = router;
