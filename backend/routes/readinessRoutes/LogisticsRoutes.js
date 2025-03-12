const express = require("express");
const router = express.Router();
const { createLogistics, getAllLogistics, getLogisticsById, updateLogistics, deleteLogistics } = require("../../controllers/readinessControllers/logisticsController");

router.post("/", createLogistics);
router.get("/", getAllLogistics);
router.get("/:id", getLogisticsById);
router.put("/:id", updateLogistics);
router.delete("/:id", deleteLogistics);

module.exports = router;
