const express = require("express");
const router = express.Router();
const {
  showUserInfo,
  updateUserRoles, // ✅ Changed to reflect multiple roles handling
  updateCurrentUser,
  deleteCurrentUser
} = require("../controllers/userController");

const { protect, verifyAdmin } = require("../middlewares/authMiddleware");

// 🔹 Get Current User Profile (Protected)
router.get("/profile", protect, showUserInfo);

// 🔹 Update Current User Profile (Protected)
router.put("/update-profile", protect, updateCurrentUser);

// 🔹 Update User Roles (Admin Only)
router.put("/role/:license", protect, verifyAdmin, updateUserRoles);

// 🔹 Delete Current User Account (Protected)
router.delete("/delete", protect, deleteCurrentUser);

module.exports = router;
