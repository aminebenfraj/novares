"use strict";

var express = require("express");
var _require = require("../controllers/designController"),
  createDesign = _require.createDesign,
  getAllDesigns = _require.getAllDesigns,
  getDesignById = _require.getDesignById,
  updateDesign = _require.updateDesign,
  deleteDesign = _require.deleteDesign;
var router = express.Router();

// ✅ Create a new Design with associated tasks
router.post("/", createDesign);

// ✅ Get all Designs with their tasks
router.get("/", getAllDesigns);

// ✅ Get a specific Design by ID
router.get("/:id", getDesignById);

// ✅ Update a Design and its tasks
router.put("/:id", updateDesign);

// ✅ Delete a Design and its associated tasks
router["delete"]("/:id", deleteDesign);
module.exports = router;