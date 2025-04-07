"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/adminController"),
  getAllUsers = _require.getAllUsers,
  getUserByLicense = _require.getUserByLicense,
  createUser = _require.createUser,
  adminUpdateUser = _require.adminUpdateUser,
  updateUserRoles = _require.updateUserRoles,
  adminDeleteUser = _require.adminDeleteUser;
var _require2 = require("../middlewares/authMiddleware"),
  protect = _require2.protect,
  verifyAdmin = _require2.verifyAdmin;

// 🔹 Admin Only Routes
router.get("/all", protect, verifyAdmin, getAllUsers);
router.get("/:license", protect, verifyAdmin, getUserByLicense);
router.post("/create", protect, verifyAdmin, createUser);
router.put("/update/:license", protect, verifyAdmin, adminUpdateUser);
router.put("/role/:license", protect, verifyAdmin, updateUserRoles);
router["delete"]("/delete/:license", protect, verifyAdmin, adminDeleteUser);
module.exports = router;