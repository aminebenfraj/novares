const express = require("express");
const router = express.Router();
const { protect, verifyAdmin } = require("../middlewares/authMiddleware");
const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = require("../controllers/customerController");


// 🟢 Get all customers (Admin only)
router.get("/", protect, verifyAdmin, getAllCustomers);

// 🔵 Create a new customer (Admin only)
router.post("/", protect, verifyAdmin, createCustomer);

// 🟠 Update a customer by ID (Admin only)
router.put("/:id", protect, verifyAdmin, updateCustomer);

// 🔴 Delete a customer by ID (Admin only)
router.delete("/:id", protect, verifyAdmin, deleteCustomer);

module.exports = router;
