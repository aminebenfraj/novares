const ProcessStatusIndustrials = require('../../models/readiness/ProcessStatusIndustrialsModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all process status industrials
exports.getAllProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrials = await ProcessStatusIndustrials.find()
      .populate({
        path: 'processComplete.details processParametersIdentified.details pokaYokesIdentifiedAndEffective.details specificBoundaryPartsSamples.details gaugesAcceptedByPlant.details processCapabilitiesPerformed.details pfmeaIssuesAddressed.details reversePfmeaPerformed.details industrialMeansAccepted.details',
        model: 'Validation'
      });
    res.status(200).json(processStatusIndustrials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single process status industrials by ID
exports.getProcessStatusIndustrialsById = async (req, res) => {
  try {
    const processStatusIndustrials = await ProcessStatusIndustrials.findById(req.params.id)
      .populate({
        path: 'processComplete.details processParametersIdentified.details pokaYokesIdentifiedAndEffective.details specificBoundaryPartsSamples.details gaugesAcceptedByPlant.details processCapabilitiesPerformed.details pfmeaIssuesAddressed.details reversePfmeaPerformed.details industrialMeansAccepted.details',
        model: 'Validation'
      });
    if (!processStatusIndustrials) {
      return res.status(404).json({ message: 'Process status industrials not found' });
    }
    res.status(200).json(processStatusIndustrials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new process status industrials
exports.createProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrials = new ProcessStatusIndustrials(req.body);
    const newProcessStatusIndustrials = await processStatusIndustrials.save();
    res.status(201).json(newProcessStatusIndustrials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a process status industrials
exports.updateProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrials = await ProcessStatusIndustrials.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!processStatusIndustrials) {
      return res.status(404).json({ message: 'Process status industrials not found' });
    }
    res.status(200).json(processStatusIndustrials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a process status industrials
exports.deleteProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrials = await ProcessStatusIndustrials.findByIdAndDelete(req.params.id);
    if (!processStatusIndustrials) {
      return res.status(404).json({ message: 'Process status industrials not found' });
    }
    res.status(200).json({ message: 'Process status industrials deleted successfully' });
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
    const processStatusIndustrials = await ProcessStatusIndustrials.findById(id);
    if (!processStatusIndustrials) {
      return res.status(404).json({ message: 'Process status industrials not found' });
    }
    
    if (!processStatusIndustrials[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = processStatusIndustrials[field].details;
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
    
    // Update the process status industrials field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedProcessStatusIndustrials = await ProcessStatusIndustrials.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedProcessStatusIndustrials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
