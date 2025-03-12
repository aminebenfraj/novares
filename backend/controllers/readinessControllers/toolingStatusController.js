const ToolingStatus = require('../../models/readiness/ToolingStatusModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all tooling statuses
exports.getAllToolingStatuses = async (req, res) => {
  try {
    const toolingStatuses = await ToolingStatus.find()
      .populate({
        path: 'manufacturedPartsAtLastRelease.details specificationsConformity.details partsGrainedAndValidated.details noBreakOrIncidentDuringInjectionTrials.details toolsAccepted.details preSerialInjectionParametersDefined.details serialProductionInjectionParametersDefined.details incompletePartsProduced.details toolmakerIssuesEradicated.details checkingFixturesAvailable.details',
        model: 'Validation'
      });
    res.status(200).json(toolingStatuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single tooling status by ID
exports.getToolingStatusById = async (req, res) => {
  try {
    const toolingStatus = await ToolingStatus.findById(req.params.id)
      .populate({
        path: 'manufacturedPartsAtLastRelease.details specificationsConformity.details partsGrainedAndValidated.details noBreakOrIncidentDuringInjectionTrials.details toolsAccepted.details preSerialInjectionParametersDefined.details serialProductionInjectionParametersDefined.details incompletePartsProduced.details toolmakerIssuesEradicated.details checkingFixturesAvailable.details',
        model: 'Validation'
      });
    if (!toolingStatus) {
      return res.status(404).json({ message: 'Tooling status not found' });
    }
    res.status(200).json(toolingStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new tooling status
exports.createToolingStatus = async (req, res) => {
  try {
    const toolingStatus = new ToolingStatus(req.body);
    const newToolingStatus = await toolingStatus.save();
    res.status(201).json(newToolingStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a tooling status
exports.updateToolingStatus = async (req, res) => {
  try {
    const toolingStatus = await ToolingStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!toolingStatus) {
      return res.status(404).json({ message: 'Tooling status not found' });
    }
    res.status(200).json(toolingStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tooling status
exports.deleteToolingStatus = async (req, res) => {
  try {
    const toolingStatus = await ToolingStatus.findByIdAndDelete(req.params.id);
    if (!toolingStatus) {
      return res.status(404).json({ message: 'Tooling status not found' });
    }
    res.status(200).json({ message: 'Tooling status deleted successfully' });
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
    const toolingStatus = await ToolingStatus.findById(id);
    if (!toolingStatus) {
      return res.status(404).json({ message: 'Tooling status not found' });
    }
    
    if (!toolingStatus[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = toolingStatus[field].details;
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
    
    // Update the tooling status field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedToolingStatus = await ToolingStatus.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedToolingStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
