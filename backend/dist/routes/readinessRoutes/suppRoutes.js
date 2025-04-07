"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/suppController"),
  createSupp = _require.createSupp,
  getAllSupps = _require.getAllSupps,
  getSuppById = _require.getSuppById,
  updateSupp = _require.updateSupp,
  deleteSupp = _require.deleteSupp;
router.post("/", createSupp);
router.get("/", getAllSupps);
router.get("/:id", getSuppById);
router.put("/:id", updateSupp);
router["delete"]("/:id", deleteSupp);
module.exports = router;