"use strict";

var express = require("express");
var _require = require("../controllers/process_qualifController"),
  createProcessQualif = _require.createProcessQualif,
  getAllProcessQualifs = _require.getAllProcessQualifs,
  getProcessQualifById = _require.getProcessQualifById,
  updateProcessQualif = _require.updateProcessQualif,
  deleteProcessQualif = _require.deleteProcessQualif;
var router = express.Router();

// Create a new ProcessQualif
router.post("/", createProcessQualif);

// Get all ProcessQualif records
router.get("/", getAllProcessQualifs);

// Get a single ProcessQualif by ID
router.get("/:id", getProcessQualifById);

// Update a ProcessQualif by ID
router.put("/:id", updateProcessQualif);

// Delete a ProcessQualif by ID
router["delete"]("/:id", deleteProcessQualif);
module.exports = router;