const Documentation = require('../../models/readiness/DocumentationModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all documentation records
exports.getAllDocumentations = async (req, res) => {
  try {
    const documentations = await Documentation.find()
      .populate({
        path: 'workStandardsInPlace.details polyvalenceMatrixUpdated.details gaugesAvailable.details qualityFileApproved.details drpUpdated.details',
        model: 'Validation'
      });
    res.status(200).json(documentations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single documentation by ID
exports.getDocumentationById = async (req, res) => {
  try {
    const documentation = await Documentation.findById(req.params.id)
      .populate({
        path: 'workStandardsInPlace.details polyvalenceMatrixUpdated.details gaugesAvailable.details qualityFileApproved.details drpUpdated.details',
        model: 'Validation'
      });
    if (!documentation) {
      return res.status(404).json({ message: 'Documentation not found' });
    }
    res.status(200).json(documentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new documentation
exports.createDocumentation = async (req, res) => {
  try {
    const documentation = new Documentation(req.body);
    const newDocumentation = await documentation.save();
    res.status(201).json(newDocumentation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a documentation
exports.updateDocumentation = async (req, res) => {
  try {
    const documentation = await Documentation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!documentation) {
      return res.status(404).json({ message: 'Documentation not found' });
    }
    res.status(200).json(documentation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a documentation
exports.deleteDocumentation = async (req, res) => {
  try {
    const documentation = await Documentation.findByIdAndDelete(req.params.id);
    if (!documentation) {
      return res.status(404).json({ message: 'Documentation not found' });
    }
    res.status(200).json({ message: 'Documentation deleted successfully' });
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
    const documentation = await Documentation.findById(id);
    if (!documentation) {
      return res.status(404).json({ message: 'Documentation not found' });
    }
    
    if (!documentation[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = documentation[field].details;
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
    
    // Update the documentation field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedDocumentation = await Documentation.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedDocumentation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};