"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/packagingController"),
  getPackagingById = _require.getPackagingById,
  getAllPackagings = _require.getAllPackagings,
  createPackaging = _require.createPackaging,
  updatePackaging = _require.updatePackaging,
  deletePackaging = _require.deletePackaging;
router.post("/", createPackaging);
router.get("/", getAllPackagings);
router.get("/:id", getPackagingById);
router.put("/:id", updatePackaging);
router["delete"]("/:id", deletePackaging);
module.exports = router;