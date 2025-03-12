const RunAtRateProduction = require('../../models/readiness/RunAtRateProductionModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all run at rate production records
exports.getAllRunAtRateProductions = async (req, res) => {
  try {
    const runAtRateProductions = await RunAtRateProduction.find()
      .populate({
        path: 'qualityWallInPlace.details selfRunRatePerformed.details dimensionalInspectionsConform.details rampUpDefined.details mppAuditCompleted.details reversePFMEACompleted.details paceBoardFollowUp.details',
        model: 'Validation'
      });
    res.status(200).json(runAtRateProductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single run at rate production by ID
exports.getRunAtRateProductionById = async (req, res) => {
  try {
    const runAtRateProduction = await RunAtRateProduction.findById(req.params.id)
      .populate({
        path: 'qualityWallInPlace.details selfRunRatePerformed.details dimensionalInspectionsConform.details rampUpDefined.details mppAuditCompleted.details reversePFMEACompleted.details paceBoardFollowUp.details',
        model: 'Validation'
      });
    if (!runAtRateProduction) {
      return res.status(404).json({ message: 'Run at rate production not found' });
    }
    res.status(200).json(runAtRateProduction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new run at rate production
exports.createRunAtRateProduction = async (req, res) => {
  try {
    const runAtRateProduction = new RunAtRateProduction(req.body);
    const newRunAtRateProduction = await runAtRateProduction.save();
    res.status(201).json(newRunAtRateProduction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a run at rate production
exports.updateRunAtRateProduction = async (req, res) => {
  try {
    const runAtRateProduction = await RunAtRateProduction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!runAtRateProduction) {
      return res.status(404).json({ message: 'Run at rate production not found' });
    }
    res.status(200).json(runAtRateProduction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a run at rate production
exports.deleteRunAtRateProduction = async (req, res) => {
  try {
    const runAtRateProduction = await RunAtRateProduction.findByIdAndDelete(req.params.id);
    if (!runAtRateProduction) {
      return res.status(404).json({ message: 'Run at rate production not found' });
    }
    res.status(200).json({ message: 'Run at rate production deleted successfully' });
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
    const runAtRateProduction = await RunAtRateProduction.findById(id);
    if (!runAtRateProduction) {
      return res.status(404).json({ message: 'Run at rate production not found' });
    }
    
    if (!runAtRateProduction[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = runAtRateProduction[field].details;
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
    
    // Update the run at rate production field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedRunAtRateProduction = await RunAtRateProduction.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedRunAtRateProduction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
