const express = require("express")
const {
  createDesign,
  getAllDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
} = require("../controllers/designController")
const router = express.Router()

// ✅ Create a new Design with associated tasks
router.post("/", createDesign)

// ✅ Get all Designs with their tasks
router.get("/", getAllDesigns)

// ✅ Get a specific Design by ID
router.get("/:id", getDesignById)

// ✅ Update a Design and its tasks
router.put("/:id", updateDesign)

// ✅ Delete a Design and its associated tasks
router.delete("/:id", deleteDesign)

module.exports = router

