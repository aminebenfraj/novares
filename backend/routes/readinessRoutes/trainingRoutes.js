const express = require("express");
const router = express.Router();
const { createTraining, getAllTrainings, getTrainingById, updateTraining, deleteTraining } = require("../../controllers/readinessControllers/trainingController");

router.post("/", createTraining);
router.get("/", getAllTrainings);
router.get("/:id", getTrainingById);
router.put("/:id", updateTraining);
router.delete("/:id", deleteTraining);

module.exports = router;
