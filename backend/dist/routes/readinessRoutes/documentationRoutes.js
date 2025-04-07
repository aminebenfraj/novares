"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/readinessControllers/documentation"),
  createDocumentation = _require.createDocumentation,
  getDocumentationById = _require.getDocumentationById,
  updateDocumentation = _require.updateDocumentation,
  deleteDocumentation = _require.deleteDocumentation,
  getAllDocumentations = _require.getAllDocumentations;
router.post("/", createDocumentation);
router.get("/", getAllDocumentations);
router.get("/:id", getDocumentationById);
router.put("/:id", updateDocumentation);
router["delete"]("/:id", deleteDocumentation);
module.exports = router;