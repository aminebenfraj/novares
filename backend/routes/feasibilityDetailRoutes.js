// routes/feasibilityDetailRoutes.js
const express = require('express');
const router = express.Router();
const { createFeasibilityDetail, getAllFeasibilityDetails, getFeasibilityDetailById, updateFeasibilityDetail, deleteFeasibilityDetail } = require("../controllers/feasibilityDetailController");
router.post('/', createFeasibilityDetail);
router.get('/', getAllFeasibilityDetails);
router.get('/:id', getFeasibilityDetailById);
router.put('/:id', updateFeasibilityDetail);
router.delete('/:id', deleteFeasibilityDetail);

module.exports = router;