const express = require("express")
const {
  createMassProduction,
  getAllMassProductions,
  getMassProductionById,
  updateMassProduction,
  deleteMassProduction,
  getFilterOptions,
} = require("../controllers/massProductionController")

const { protect, verifyAdmin } = require("../middlewares/authMiddleware")

const router = express.Router()

// Mass Production Routes
router.post("/create", protect, verifyAdmin, createMassProduction)
router.get("/", protect, getAllMassProductions)
router.get("/filters/:field", protect, getFilterOptions)
router.get("/:id", protect, getMassProductionById)
router.put("/:id", protect, updateMassProduction)
router.delete("/:id", protect, verifyAdmin, deleteMassProduction)

module.exports = router
