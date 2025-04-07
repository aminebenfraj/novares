"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/userController"),
  showUserInfo = _require.showUserInfo,
  updateUserRoles = _require.updateUserRoles,
  updateCurrentUser = _require.updateCurrentUser,
  deleteCurrentUser = _require.deleteCurrentUser,
  getCustomerById = _require.getCustomerById,
  getAllCustomers = _require.getAllCustomers,
  getRecentUsers = _require.getRecentUsers;
var _require2 = require("../middlewares/authMiddleware"),
  protect = _require2.protect,
  verifyAdmin = _require2.verifyAdmin;
router.get("/customers", protect, verifyAdmin, getAllCustomers);
// 🔹 Get Customer by ID (Admin Only)
router.get("/customer/:id", protect, verifyAdmin, getCustomerById);
// 🔹 Get Current User Profile (Protected)
router.get("/profile", protect, showUserInfo);

// 🔹 Update Current User Profile (Protected)
router.put("/update-profile", protect, updateCurrentUser);

// 🔹 Update User Roles (Admin Only)
router.put("/role/:license", protect, verifyAdmin, updateUserRoles);

// 🔹 Delete Current User Account (Protected)
router["delete"]("/delete", protect, deleteCurrentUser);
router.get("/recent", getRecentUsers); // ✅ Ensure the user is authenticated

module.exports = router;