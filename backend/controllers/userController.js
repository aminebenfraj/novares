const bcrypt = require("bcryptjs");
const User = require("../models/UserModel"); // Adjust the path as needed

// 🔹 Get current user information (Authenticated user)
exports.showUserInfo = async (req, res) => {
  try {
    // Find user by license (assuming license is unique)
    const user = await User.findOne({ lisence: req.user.lisence }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);
    
    // Return user information
    res.json({
      lisence: user.lisence,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ error: "Error fetching user information" });
  }
};

// 🔹 Update a user's role (Admin Only)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  // Validate role
  if (!["admin", "user", "customer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Find the user by license
    const user = await User.findOne({ lisence: req.params.lisence });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user role
    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", updatedRole: user.role });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Error updating user role" });
  }
};

// 🔹 Update current user information (Authenticated User)
exports.updateCurrentUser = async (req, res) => {
  try {
    const { username, email, password, image } = req.body;

    // Find the user by license
    const user = await User.findOne({ lisence: req.user.lisence });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (image) user.image = image;

    // If a new password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user
    await user.save();

    res.json({
      message: "User updated successfully",
      username: user.username,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.error("Error updating current user:", error);
    res.status(500).json({ error: "Error updating user information" });
  }
};

// 🔹 Delete current user account (Authenticated User)
exports.deleteCurrentUser = async (req, res) => {
  try {
    // Validate user existence
    const user = await User.findOne({ lisence: req.user.lisence });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await user.remove();

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};
