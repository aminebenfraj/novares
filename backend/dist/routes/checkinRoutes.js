"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/checkinController"),
  createCheckin = _require.createCheckin,
  getAllCheckins = _require.getAllCheckins,
  getCheckinById = _require.getCheckinById,
  updateCheckin = _require.updateCheckin,
  deleteCheckin = _require.deleteCheckin;
router.post("/", createCheckin);
router.get("/", getAllCheckins);
router.get("/:id", getCheckinById);
router.put("/:id", updateCheckin);
router["delete"]("/:id", deleteCheckin);
module.exports = router;