const express = require("express");
const {
  createMassProduction,
  getAllMassProductions,
  getMassProductionById,
  updateMassProduction,
  deleteMassProduction,
} = require("../controllers/massProductionController");

const router = express.Router();

// ✅ MassProduction Routes
router.post("/", createMassProduction);
router.get("/", getAllMassProductions);
router.get("/:id", getMassProductionById);
router.put("/:id", updateMassProduction);
router.delete("/:id", deleteMassProduction);

module.exports = router;
