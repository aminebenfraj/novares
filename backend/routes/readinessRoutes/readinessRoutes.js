const express = require("express")
const {
  createReadiness,
  getAllReadiness,
  getReadinessById,
  updateReadiness,
  deleteReadiness,
  getFilterOptions,
} = require("../../controllers/readinessControllers/readinessController")
const router = express.Router()

// Create a new Readiness entry
router.post("/", createReadiness)

// Get all Readiness entries with filtering and pagination
router.get("/", getAllReadiness)

// Get filter options for dropdown menus
router.get("/filters/:field", getFilterOptions)

// Get a single Readiness by ID
router.get("/:id", getReadinessById)

// Update a Readiness entry
router.put("/:id", updateReadiness)

// Delete a Readiness entry
router.delete("/:id", deleteReadiness)

module.exports = router
