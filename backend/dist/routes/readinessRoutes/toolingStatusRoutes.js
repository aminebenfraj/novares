"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/toolingStatusController"),
  createToolingStatus = _require.createToolingStatus,
  getAllToolingStatuses = _require.getAllToolingStatuses,
  getToolingStatusById = _require.getToolingStatusById,
  updateToolingStatus = _require.updateToolingStatus,
  deleteToolingStatus = _require.deleteToolingStatus;
router.post("/", createToolingStatus);
router.get("/", getAllToolingStatuses);
router.get("/:id", getToolingStatusById);
router.put("/:id", updateToolingStatus);
router["delete"]("/:id", deleteToolingStatus);
module.exports = router;