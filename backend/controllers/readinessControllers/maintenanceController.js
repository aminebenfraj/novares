const Maintenance = require('../../models/readiness/MaintenanceModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all maintenance records
exports.getAllMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find()
      .populate({
        path: 'sparePartsIdentifiedAndAvailable.details processIntegratedInPlantMaintenance.details maintenanceStaffTrained.details',
        model: 'Validation'
      });
    res.status(200).json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single maintenance by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate({
        path: 'sparePartsIdentifiedAndAvailable.details processIntegratedInPlantMaintenance.details maintenanceStaffTrained.details',
        model: 'Validation'
      });
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found' });
    }
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    const newMaintenance = await maintenance.save();
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found' });
    }
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a maintenance
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found' });
    }
    res.status(200).json({ message: 'Maintenance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update validation details for a specific field
exports.updateValidationField = async (req, res) => {
  try {
    const { id, field } = req.params;
    const { value, validationData } = req.body;
    
    // Check if the field exists in the model
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found' });
    }
    
    if (!maintenance[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = maintenance[field].details;
    let validation;
    
    if (validationData) {
      if (validationId) {
        // Update existing validation
        validation = await Validation.findByIdAndUpdate(
          validationId,
          validationData,
          { new: true, runValidators: true }
        );
      } else {
        // Create new validation
        validation = new Validation(validationData);
        await validation.save();
        validationId = validation._id;
      }
    }
    
    // Update the maintenance field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
