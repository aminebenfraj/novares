"use strict";

var express = require("express");
var _require = require("../../controllers/gestionStockControllers/materialMachineController"),
  allocateStock = _require.allocateStock,
  getAllAllocations = _require.getAllAllocations,
  getMaterialAllocations = _require.getMaterialAllocations,
  getMachineStockHistory = _require.getMachineStockHistory,
  updateAllocation = _require.updateAllocation;
var router = express.Router();
router.post("/", allocateStock);
router.get("/allocates", getAllAllocations);
router.get("/material/:materialId", getMaterialAllocations);
router.get("/machine/:machineId/history", getMachineStockHistory);
router.put("/:id", updateAllocation);
module.exports = router;