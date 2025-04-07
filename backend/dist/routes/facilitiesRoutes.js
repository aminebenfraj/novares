"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/facilitiesController"),
  createFacilities = _require.createFacilities,
  getAllFacilities = _require.getAllFacilities,
  getFacilitiesById = _require.getFacilitiesById,
  updateFacilities = _require.updateFacilities,
  deleteFacilities = _require.deleteFacilities;
router.post("/", createFacilities);
router.get("/", getAllFacilities);
router.get("/:id", getFacilitiesById);
router.put("/:id", updateFacilities);
router["delete"]("/:id", deleteFacilities);
module.exports = router;