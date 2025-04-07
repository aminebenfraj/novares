"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/safetyController"),
  createSafety = _require.createSafety,
  getSafetyById = _require.getSafetyById,
  updateSafety = _require.updateSafety,
  deleteSafety = _require.deleteSafety,
  getAllSafeties = _require.getAllSafeties;
router.post("/", createSafety);
router.get("/", getAllSafeties);
router.get("/:id", getSafetyById);
router.put("/:id", updateSafety);
router["delete"]("/:id", deleteSafety);
module.exports = router;