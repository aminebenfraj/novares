"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/productProcessController"),
  createProductProcess = _require.createProductProcess,
  getAllProductProcesses = _require.getAllProductProcesses,
  getProductProcessById = _require.getProductProcessById,
  updateProductProcess = _require.updateProductProcess,
  deleteProductProcess = _require.deleteProductProcess;
router.post("/", createProductProcess);
router.get("/", getAllProductProcesses);
router.get("/:id", getProductProcessById);
router.put("/:id", updateProductProcess);
router["delete"]("/:id", deleteProductProcess);
module.exports = router;