"use strict";

var express = require("express");
var _require = require("../controllers/massProductionController"),
  createMassProduction = _require.createMassProduction,
  getAllMassProductions = _require.getAllMassProductions,
  getMassProductionById = _require.getMassProductionById,
  updateMassProduction = _require.updateMassProduction,
  deleteMassProduction = _require.deleteMassProduction;
var _require2 = require("../middlewares/authMiddleware"),
  protect = _require2.protect,
  verifyAdmin = _require2.verifyAdmin; // ✅ Middleware for security

var router = express.Router();

// ✅ MassProduction Routes (with Email Integration)
router.post("/create", protect, verifyAdmin, createMassProduction); // ✅ Create & send email
router.get("/", protect, getAllMassProductions); // ✅ Get all (only authenticated users)
router.get("/:id", protect, getMassProductionById); // ✅ Get one by ID
router.put("/:id", protect, verifyAdmin, updateMassProduction); // ✅ Only Admin can update
router["delete"]("/:id", protect, verifyAdmin, deleteMassProduction); // ✅ Only Admin can delete

module.exports = router;