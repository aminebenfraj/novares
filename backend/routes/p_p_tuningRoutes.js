const express = require("express");
const { createP_P_Tuning, getAllP_P_Tuning, getP_P_TuningById, updateP_P_Tuning, deleteP_P_Tuning } = require("../controllers/p_p_tuningController");

const router = express.Router();

// Create a new P_P_Tuning record
router.post("/", createP_P_Tuning);

// Get all P_P_Tuning records
router.get("/", getAllP_P_Tuning);

// Get a specific P_P_Tuning record by ID
router.get("/:id", getP_P_TuningById);

// Update a P_P_Tuning record by ID
router.put("/:id", updateP_P_Tuning);

// Delete a P_P_Tuning record by ID
router.delete("/:id", deleteP_P_Tuning);

module.exports = router;