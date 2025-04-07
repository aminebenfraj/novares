"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/trainingController"),
  createTraining = _require.createTraining,
  getAllTrainings = _require.getAllTrainings,
  getTrainingById = _require.getTrainingById,
  updateTraining = _require.updateTraining,
  deleteTraining = _require.deleteTraining;
router.post("/", createTraining);
router.get("/", getAllTrainings);
router.get("/:id", getTrainingById);
router.put("/:id", updateTraining);
router["delete"]("/:id", deleteTraining);
module.exports = router;