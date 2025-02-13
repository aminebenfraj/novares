const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// 🟢 Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// 🔵 Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new User({
      lisence: "N/A", // Default value (modify as needed)
      username,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer created successfully", newCustomer });
  } catch (error) {
    res.status(500).json({ error: "Failed to create customer" });
  }
};

// 🟠 Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const updatedCustomer = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );

    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });

    res.json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// 🔴 Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await User.findByIdAndDelete(id);

    if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
