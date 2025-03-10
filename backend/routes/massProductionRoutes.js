const express = require("express");
const {
  createMassProduction,
  getAllMassProductions,
  getMassProductionById,
  updateMassProduction,
  deleteMassProduction,
  updateMassProductionStep,
} = require("../controllers/massProductionController");

const { protect, verifyAdmin } = require("../middlewares/authMiddleware"); // ✅ Middleware for security

const router = express.Router();

// ✅ MassProduction Routes (with Email Integration)
router.post("/create", protect, verifyAdmin, createMassProduction); // ✅ Create & send email
router.get("/", protect, getAllMassProductions); // ✅ Get all (only authenticated users)
router.get("/:id", protect, getMassProductionById); // ✅ Get one by ID
router.put("/:id", protect, verifyAdmin, updateMassProduction); // ✅ Only Admin can update
router.delete("/:id", protect, verifyAdmin, deleteMassProduction); // ✅ Only Admin can delete
router.post("/:id/steps", updateMassProductionStep)


module.exports = router;
