const express = require("express");
const router = express.Router();
const {getAllMaintenances, createMaintenance, getMaintenanceById, updateMaintenance, deleteMaintenance } = require("../../controllers/readinessControllers/maintenanceController");

router.post("/", createMaintenance);
router.get("/", getAllMaintenances);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

module.exports = router;
