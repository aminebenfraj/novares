"use strict";

var express = require('express');
var _require = require('../../controllers/gestionStockControllers/supplierController'),
  createSupplier = _require.createSupplier,
  getAllSuppliers = _require.getAllSuppliers,
  getSupplierById = _require.getSupplierById,
  updateSupplier = _require.updateSupplier,
  deleteSupplier = _require.deleteSupplier;
var router = express.Router();

// CRUD Routes for Supplier
router.post('/', createSupplier); // Create Supplier
router.get('/', getAllSuppliers); // Get All Suppliers
router.get('/:id', getSupplierById); // Get Supplier by ID
router.put('/:id', updateSupplier); // Update Supplier
router["delete"]('/:id', deleteSupplier); // Delete Supplier

module.exports = router;