"use strict";

var express = require("express");
var _require = require("../controllers/authController"),
  registerUser = _require.registerUser,
  loginUser = _require.loginUser,
  currentUser = _require.currentUser;
var _require2 = require("../middlewares/authMiddleware"),
  protect = _require2.protect;
var router = express.Router();

// 🔹 Register a new user
router.post("/register", registerUser);

// 🔹 Login user and return JWT token
router.post("/login", loginUser);

// 🔹 Get current user info (Protected route)
router.get("/current-user", protect, currentUser);
module.exports = router;