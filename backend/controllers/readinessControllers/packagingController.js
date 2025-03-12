const Packaging = require('../../models/readiness/PackagingModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all packaging records
exports.getAllPackagings = async (req, res) => {
  try {
    const packagings = await Packaging.find()
      .populate({
        path: 'customerDefined.details returnableLoops.details smallBatchSubstitute.details rampUpReady.details',
        model: 'Validation'
      });
    res.status(200).json(packagings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single packaging by ID
exports.getPackagingById = async (req, res) => {
  try {
    const packaging = await Packaging.findById(req.params.id)
      .populate({
        path: 'customerDefined.details returnableLoops.details smallBatchSubstitute.details rampUpReady.details',
        model: 'Validation'
      });
    if (!packaging) {
      return res.status(404).json({ message: 'Packaging not found' });
    }
    res.status(200).json(packaging);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new packaging
exports.createPackaging = async (req, res) => {
  try {
    const packaging = new Packaging(req.body);
    const newPackaging = await packaging.save();
    res.status(201).json(newPackaging);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a packaging
exports.updatePackaging = async (req, res) => {
  try {
    const packaging = await Packaging.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!packaging) {
      return res.status(404).json({ message: 'Packaging not found' });
    }
    res.status(200).json(packaging);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a packaging
exports.deletePackaging = async (req, res) => {
  try {
    const packaging = await Packaging.findByIdAndDelete(req.params.id);
    if (!packaging) {
      return res.status(404).json({ message: 'Packaging not found' });
    }
    res.status(200).json({ message: 'Packaging deleted successfully' });
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
    const packaging = await Packaging.findById(id);
    if (!packaging) {
      return res.status(404).json({ message: 'Packaging not found' });
    }
    
    if (!packaging[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = packaging[field].details;
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
    
    // Update the packaging field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedPackaging = await Packaging.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedPackaging);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
