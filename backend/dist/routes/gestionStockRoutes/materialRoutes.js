"use strict";

var express = require("express");
var _require = require("../../controllers/gestionStockControllers/materialController"),
  createMaterial = _require.createMaterial,
  getAllMaterials = _require.getAllMaterials,
  getMaterialById = _require.getMaterialById,
  updateMaterial = _require.updateMaterial,
  deleteMaterial = _require.deleteMaterial,
  getFilterOptions = _require.getFilterOptions;
var router = express.Router();

// CRUD routes
router.post("/", createMaterial);
router.get("/", getAllMaterials);
router.get("/filters/:field", getFilterOptions);
router.get("/:id", getMaterialById);
router.put("/:id", updateMaterial);
router["delete"]("/:id", deleteMaterial);
module.exports = router;