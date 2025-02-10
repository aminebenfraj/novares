const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 🔹 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { lisence: user.lisence, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// 🔹 Register a New User

exports.registerUser = async (req, res) => {
  try {
    const { lisence, username, email, password, role, image } = req.body;

    // 1️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2️⃣ Hash the password before saving
    console.log("🔹 Hashing password before saving...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Hashed Password:", hashedPassword);

    // 3️⃣ Create a new user with the hashed password
    const user = new User({
      lisence,
      username,
      email,
      password: hashedPassword, // 🔹 Ensure hashed password is saved
      role: role || "user",
      image: image || null,
    });

    await user.save();
    console.log("✅ User Registered Successfully:", user);

    // 4️⃣ Generate Token
    const token = jwt.sign(
      { lisence: user.lisence, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      lisence: user.lisence,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      token,
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Request Received:");
    console.log("📧 Email:", email);
    console.log("🔑 Entered Password:", password);

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    console.log("👤 User Found in Database:", user);

    if (!user) {
      console.log("❌ No user found with this email");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords
    console.log("🔹 Comparing entered password with stored hashed password...");
    console.log("🔹 Hashed Password in DB:", user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match Status:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3️⃣ Generate Token
    const token = jwt.sign(
      { lisence: user.lisence, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("✅ Token Generated:", token);

    // 4️⃣ Send response
    res.json({
      lisence: user.lisence,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      token,
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// 🔹 Get Current Logged-in User (Protected)
exports.currentUser = async (req, res) => {
  try {
    if (req.user) {
      res.json({
        lisence: req.user.lisence,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
