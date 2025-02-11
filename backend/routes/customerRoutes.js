const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");

// ✅ Create a customer
router.post("/", CustomerController.createCustomer);

// ✅ Get all customers
router.get("/", CustomerController.getAllCustomers);

// ✅ Get a customer by ID
router.get("/:id", CustomerController.getCustomerById);

// ✅ Update a customer
router.put("/:id", CustomerController.updateCustomer);

// ✅ Delete a customer
router.delete("/:id", CustomerController.deleteCustomer);

module.exports = router;
