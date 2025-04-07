"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/productDesignationController"),
  createProduct = _require.createProduct,
  getAllProducts = _require.getAllProducts,
  getProductById = _require.getProductById,
  updateProduct = _require.updateProduct,
  deleteProduct = _require.deleteProduct;

// 🔹 Define CRUD routes
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router["delete"]("/:id", deleteProduct);
module.exports = router;