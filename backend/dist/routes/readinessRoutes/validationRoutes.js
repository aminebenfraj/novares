"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/validationController"),
  createValidation = _require.createValidation,
  getAllValidations = _require.getAllValidations,
  getValidationById = _require.getValidationById,
  updateValidation = _require.updateValidation,
  deleteValidation = _require.deleteValidation;
router.post("/", createValidation);
router.get("/", getAllValidations);
router.get("/:id", getValidationById);
router.put("/:id", updateValidation);
router["delete"]("/:id", deleteValidation);
module.exports = router;