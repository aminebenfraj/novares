const express = require("express");
const { createProcessQualif, getAllProcessQualifs, getProcessQualifById, updateProcessQualif, deleteProcessQualif } = require("../controllers/process_qualifController");
const router = express.Router();

// Create a new ProcessQualif
router.post("/", createProcessQualif);

// Get all ProcessQualif records
router.get("/", getAllProcessQualifs);

// Get a single ProcessQualif by ID
router.get("/:id", getProcessQualifById);

// Update a ProcessQualif by ID
router.put("/:id", updateProcessQualif);

// Delete a ProcessQualif by ID
router.delete("/:id", deleteProcessQualif);

module.exports = router;
