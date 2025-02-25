const express = require("express");
const { createMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial } = require("../../models/gestionStockModels/materialController");
const router = express.Router();

// CRUD routes
router.post("/", createMaterial);
router.get("/", getAllMaterials);
router.get("/:id", getMaterialById);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

module.exports = router;
