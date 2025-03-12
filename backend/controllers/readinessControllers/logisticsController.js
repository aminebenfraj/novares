const Logistics = require('../../models/readiness/LogisticsModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all logistics records
exports.getAllLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.find()
      .populate({
        path: 'loopsFlowsDefined.details storageDefined.details labelsCreated.details sapReferenced.details safetyStockReady.details',
        model: 'Validation'
      });
    res.status(200).json(logistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single logistics by ID
exports.getLogisticsById = async (req, res) => {
  try {
    const logistics = await Logistics.findById(req.params.id)
      .populate({
        path: 'loopsFlowsDefined.details storageDefined.details labelsCreated.details sapReferenced.details safetyStockReady.details',
        model: 'Validation'
      });
    if (!logistics) {
      return res.status(404).json({ message: 'Logistics not found' });
    }
    res.status(200).json(logistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new logistics
exports.createLogistics = async (req, res) => {
  try {
    const logistics = new Logistics(req.body);
    const newLogistics = await logistics.save();
    res.status(201).json(newLogistics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a logistics
exports.updateLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!logistics) {
      return res.status(404).json({ message: 'Logistics not found' });
    }
    res.status(200).json(logistics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a logistics
exports.deleteLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.findByIdAndDelete(req.params.id);
    if (!logistics) {
      return res.status(404).json({ message: 'Logistics not found' });
    }
    res.status(200).json({ message: 'Logistics deleted successfully' });
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
    const logistics = await Logistics.findById(id);
    if (!logistics) {
      return res.status(404).json({ message: 'Logistics not found' });
    }
    
    if (!logistics[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = logistics[field].details;
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
    
    // Update the logistics field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedLogistics = await Logistics.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedLogistics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};