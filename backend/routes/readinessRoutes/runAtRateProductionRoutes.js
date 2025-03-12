const express = require("express");
const router = express.Router();
const { createRunAtRateProduction, getRunAtRateProductionById, updateRunAtRateProduction, deleteRunAtRateProduction, getAllRunAtRateProductions } = require("../../controllers/readinessControllers/runAtRateProductionController");

router.post("/", createRunAtRateProduction);
router.get("/", getAllRunAtRateProductions);
router.get("/:id", getRunAtRateProductionById);
router.put("/:id", updateRunAtRateProduction);
router.delete("/:id", deleteRunAtRateProduction);

module.exports = router;
