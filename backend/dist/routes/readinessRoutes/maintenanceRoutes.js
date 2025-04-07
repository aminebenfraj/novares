"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/maintenanceController"),
  getAllMaintenances = _require.getAllMaintenances,
  createMaintenance = _require.createMaintenance,
  getMaintenanceById = _require.getMaintenanceById,
  updateMaintenance = _require.updateMaintenance,
  deleteMaintenance = _require.deleteMaintenance;
router.post("/", createMaintenance);
router.get("/", getAllMaintenances);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router["delete"]("/:id", deleteMaintenance);
module.exports = router;