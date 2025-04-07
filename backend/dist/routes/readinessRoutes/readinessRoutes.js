"use strict";

var express = require("express");
var _require = require("../../controllers/readinessControllers/readinessController"),
  createReadiness = _require.createReadiness,
  getAllReadiness = _require.getAllReadiness,
  getReadinessById = _require.getReadinessById,
  updateReadiness = _require.updateReadiness,
  deleteReadiness = _require.deleteReadiness;
var router = express.Router();

// ✅ Create a new Readiness entry
router.post("/", createReadiness);

// ✅ Get all Readiness entries with filtering and pagination
router.get("/", getAllReadiness);

// ✅ Get a single Readiness by ID
router.get("/:id", getReadinessById);

// ✅ Update a Readiness entry
router.put("/:id", updateReadiness);

// ✅ Delete a Readiness entry
router["delete"]("/:id", deleteReadiness);
module.exports = router;