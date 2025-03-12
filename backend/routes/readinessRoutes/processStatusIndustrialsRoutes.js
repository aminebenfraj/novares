const express = require("express");
const router = express.Router();
const { createProcessStatusIndustrials, getAllProcessStatusIndustrials, getProcessStatusIndustrialsById, updateProcessStatusIndustrials, deleteProcessStatusIndustrials } = require("../../controllers/readinessControllers/processStatusIndustrialsController");

router.post("/", createProcessStatusIndustrials);
router.get("/", getAllProcessStatusIndustrials);
router.get("/:id", getProcessStatusIndustrialsById);
router.put("/:id", updateProcessStatusIndustrials);
router.delete("/:id", deleteProcessStatusIndustrials);

module.exports = router;
