"use strict";

var express = require('express');
var router = express.Router();
var _require = require('../../controllers/gestionStockControllers/machineController'),
  createMachine = _require.createMachine,
  getAllMachines = _require.getAllMachines,
  getMachineById = _require.getMachineById,
  updateMachine = _require.updateMachine,
  deleteMachine = _require.deleteMachine;

// Create a new machine
router.post('/', createMachine);

// Get all machines
router.get('/', getAllMachines);

// Get a machine by ID
router.get('/:id', getMachineById);

// Update a machine
router.put('/:id', updateMachine);

// Delete a machine
router["delete"]('/:id', deleteMachine);
module.exports = router;