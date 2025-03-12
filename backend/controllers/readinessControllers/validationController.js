const Validation = require('../../models/readiness/ValidationModel');

// Get all validations
exports.getAllValidations = async (req, res) => {
  try {
    const validations = await Validation.find();
    res.status(200).json(validations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single validation by ID
exports.getValidationById = async (req, res) => {
  try {
    const validation = await Validation.findById(req.params.id);
    if (!validation) {
      return res.status(404).json({ message: 'Validation not found' });
    }
    res.status(200).json(validation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new validation
exports.createValidation = async (req, res) => {
  try {
    const validation = new Validation(req.body);
    const newValidation = await validation.save();
    res.status(201).json(newValidation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a validation
exports.updateValidation = async (req, res) => {
  try {
    const validation = await Validation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!validation) {
      return res.status(404).json({ message: 'Validation not found' });
    }
    res.status(200).json(validation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a validation
exports.deleteValidation = async (req, res) => {
  try {
    const validation = await Validation.findByIdAndDelete(req.params.id);
    if (!validation) {
      return res.status(404).json({ message: 'Validation not found' });
    }
    res.status(200).json({ message: 'Validation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};