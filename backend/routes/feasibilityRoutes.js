// routes/feasibilityRoutes.js
const express = require('express');
const router = express.Router();
const { createFeasibility, getAllFeasibilities, getFeasibilityById, updateFeasibility, deleteFeasibility } = require("../controllers/feasibilityController");
router.post('/', createFeasibility);
router.get('/', getAllFeasibilities);
router.get('/:id', getFeasibilityById);
router.put('/:id', updateFeasibility);
router.delete('/:id', deleteFeasibility);

module.exports = router;

