const Safety = require('../../models/readiness/SafetyModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all safety records
exports.getAllSafeties = async (req, res) => {
  try {
    const safeties = await Safety.find()
      .populate({
        path: 'industrialMeansCompliance.details teamTraining.details safetyOfficerInformed.details',
        model: 'Validation'
      });
    res.status(200).json(safeties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single safety by ID
exports.getSafetyById = async (req, res) => {
  try {
    const safety = await Safety.findById(req.params.id)
      .populate({
        path: 'industrialMeansCompliance.details teamTraining.details safetyOfficerInformed.details',
        model: 'Validation'
      });
    if (!safety) {
      return res.status(404).json({ message: 'Safety not found' });
    }
    res.status(200).json(safety);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new safety
exports.createSafety = async (req, res) => {
  try {
    const safety = new Safety(req.body);
    const newSafety = await safety.save();
    res.status(201).json(newSafety);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a safety
exports.updateSafety = async (req, res) => {
  try {
    const safety = await Safety.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!safety) {
      return res.status(404).json({ message: 'Safety not found' });
    }
    res.status(200).json(safety);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a safety
exports.deleteSafety = async (req, res) => {
  try {
    const safety = await Safety.findByIdAndDelete(req.params.id);
    if (!safety) {
      return res.status(404).json({ message: 'Safety not found' });
    }
    res.status(200).json({ message: 'Safety deleted successfully' });
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
    const safety = await Safety.findById(id);
    if (!safety) {
      return res.status(404).json({ message: 'Safety not found' });
    }
    
    if (!safety[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = safety[field].details;
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
    
    // Update the safety field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedSafety = await Safety.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedSafety);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
