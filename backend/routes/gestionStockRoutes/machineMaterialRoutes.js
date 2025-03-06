const express = require("express");
const { allocateStock, getAllAllocations, getMaterialAllocations, getMachineStockHistory } = require("../../controllers/gestionStockControllers/materialMachineController");
const router = express.Router();

router.post("/", allocateStock);
router.get("/allocates", getAllAllocations);
router.get("/material/:materialId", getMaterialAllocations);
router.get("/machine/:machineId/history", getMachineStockHistory);

module.exports = router;
