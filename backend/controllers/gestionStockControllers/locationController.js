const Location = require('../../models/gestionStockModels/LocationModel');

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const newLocation = new Location({ location });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create location', error });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch locations', error });
  }
};

// Get a location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch location', error });
  }
};

// Update a location
exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id, 
      { location }, 
      { new: true }
    );
    if (!updatedLocation) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error });
  }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete location', error });
  }
};
