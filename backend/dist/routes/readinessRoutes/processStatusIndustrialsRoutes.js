"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/processStatusIndustrialsController"),
  createProcessStatusIndustrials = _require.createProcessStatusIndustrials,
  getAllProcessStatusIndustrials = _require.getAllProcessStatusIndustrials,
  getProcessStatusIndustrialsById = _require.getProcessStatusIndustrialsById,
  updateProcessStatusIndustrials = _require.updateProcessStatusIndustrials,
  deleteProcessStatusIndustrials = _require.deleteProcessStatusIndustrials;
router.post("/", createProcessStatusIndustrials);
router.get("/", getAllProcessStatusIndustrials);
router.get("/:id", getProcessStatusIndustrialsById);
router.put("/:id", updateProcessStatusIndustrials);
router["delete"]("/:id", deleteProcessStatusIndustrials);
module.exports = router;