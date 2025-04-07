"use strict";

var express = require('express');
var _require = require('../../controllers/gestionStockControllers/locationController'),
  createLocation = _require.createLocation,
  getAllLocations = _require.getAllLocations,
  getLocationById = _require.getLocationById,
  updateLocation = _require.updateLocation,
  deleteLocation = _require.deleteLocation;
var router = express.Router();
router.post('/', createLocation);
router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.put('/:id', updateLocation);
router["delete"]('/:id', deleteLocation);
module.exports = router;