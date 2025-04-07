"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/runAtRateProductionController"),
  createRunAtRateProduction = _require.createRunAtRateProduction,
  getRunAtRateProductionById = _require.getRunAtRateProductionById,
  updateRunAtRateProduction = _require.updateRunAtRateProduction,
  deleteRunAtRateProduction = _require.deleteRunAtRateProduction,
  getAllRunAtRateProductions = _require.getAllRunAtRateProductions;
router.post("/", createRunAtRateProduction);
router.get("/", getAllRunAtRateProductions);
router.get("/:id", getRunAtRateProductionById);
router.put("/:id", updateRunAtRateProduction);
router["delete"]("/:id", deleteRunAtRateProduction);
module.exports = router;