"use strict";

// routes/feasibilityRoutes.js
var express = require('express');
var router = express.Router();
var _require = require("../controllers/feasibilityController"),
  createFeasibility = _require.createFeasibility,
  getAllFeasibilities = _require.getAllFeasibilities,
  getFeasibilityById = _require.getFeasibilityById,
  updateFeasibility = _require.updateFeasibility,
  deleteFeasibility = _require.deleteFeasibility;
router.post('/', createFeasibility);
router.get('/', getAllFeasibilities);
router.get('/:id', getFeasibilityById);
router.put('/:id', updateFeasibility);
router["delete"]('/:id', deleteFeasibility);
module.exports = router;