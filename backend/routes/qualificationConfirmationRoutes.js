const express = require("express");
const { createQualificationConfirmation, getAllQualificationConfirmations,getQualificationConfirmationById ,updateQualificationConfirmation,deleteQualificationConfirmation} = require("../controllers/qualificationConfirmationController");
const router = express.Router();

// Create a new QualificationConfirmation record
router.post("/", createQualificationConfirmation);

// Get all QualificationConfirmation records
router.get("/", getAllQualificationConfirmations);

// Get a specific QualificationConfirmation record by ID
router.get("/:id", getQualificationConfirmationById);

// Update a QualificationConfirmation record by ID
router.put("/:id", updateQualificationConfirmation);

// Delete a QualificationConfirmation record by ID
router.delete("/:id", deleteQualificationConfirmation);

module.exports = router;