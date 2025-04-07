"use strict";

var express = require('express');
var router = express.Router();
var _require = require('../../controllers/gestionStockControllers/categoryController'),
  createCategory = _require.createCategory,
  getAllCategories = _require.getAllCategories,
  getCategoryById = _require.getCategoryById,
  updateCategory = _require.updateCategory,
  deleteCategory = _require.deleteCategory;
// Create a new category
router.post('/', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get a category by ID
router.get('/:id', getCategoryById);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router["delete"]('/:id', deleteCategory);
module.exports = router;