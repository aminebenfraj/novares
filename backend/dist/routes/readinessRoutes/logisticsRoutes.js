"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/logisticsController"),
  createLogistics = _require.createLogistics,
  getAllLogistics = _require.getAllLogistics,
  getLogisticsById = _require.getLogisticsById,
  updateLogistics = _require.updateLogistics,
  deleteLogistics = _require.deleteLogistics;
router.post("/", createLogistics);
router.get("/", getAllLogistics);
router.get("/:id", getLogisticsById);
router.put("/:id", updateLogistics);
router["delete"]("/:id", deleteLogistics);
module.exports = router;