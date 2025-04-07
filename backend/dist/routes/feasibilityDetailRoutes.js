"use strict";

// routes/feasibilityDetailRoutes.js
var express = require('express');
var router = express.Router();
var _require = require("../controllers/feasibilityDetailController"),
  createFeasibilityDetail = _require.createFeasibilityDetail,
  getAllFeasibilityDetails = _require.getAllFeasibilityDetails,
  getFeasibilityDetailById = _require.getFeasibilityDetailById,
  updateFeasibilityDetail = _require.updateFeasibilityDetail,
  deleteFeasibilityDetail = _require.deleteFeasibilityDetail;
router.post('/', createFeasibilityDetail);
router.get('/', getAllFeasibilityDetails);
router.get('/:id', getFeasibilityDetailById);
router.put('/:id', updateFeasibilityDetail);
router["delete"]('/:id', deleteFeasibilityDetail);
module.exports = router;