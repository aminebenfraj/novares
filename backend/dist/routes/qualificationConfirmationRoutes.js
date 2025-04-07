"use strict";

var express = require("express");
var _require = require("../controllers/qualificationConfirmationController"),
  createQualificationConfirmation = _require.createQualificationConfirmation,
  getAllQualificationConfirmations = _require.getAllQualificationConfirmations,
  getQualificationConfirmationById = _require.getQualificationConfirmationById,
  updateQualificationConfirmation = _require.updateQualificationConfirmation,
  deleteQualificationConfirmation = _require.deleteQualificationConfirmation;
var router = express.Router();

// Create a new QualificationConfirmation record
router.post("/", createQualificationConfirmation);

// Get all QualificationConfirmation records
router.get("/", getAllQualificationConfirmations);

// Get a specific QualificationConfirmation record by ID
router.get("/:id", getQualificationConfirmationById);

// Update a QualificationConfirmation record by ID
router.put("/:id", updateQualificationConfirmation);

// Delete a QualificationConfirmation record by ID
router["delete"]("/:id", deleteQualificationConfirmation);
module.exports = router;