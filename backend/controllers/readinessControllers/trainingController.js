const Training = require('../../models/readiness/TrainingModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all training records
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find()
      .populate({
        path: 'visualControlQualification.details dojoTrainingCompleted.details trainingPlanDefined.details',
        model: 'Validation'
      });
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single training by ID
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
      .populate({
        path: 'visualControlQualification.details dojoTrainingCompleted.details trainingPlanDefined.details',
        model: 'Validation'
      });
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new training
exports.createTraining = async (req, res) => {
  try {
    const training = new Training(req.body);
    const newTraining = await training.save();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a training
exports.updateTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.status(200).json(training);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a training
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.status(200).json({ message: 'Training deleted successfully' });
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
    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    
    if (!training[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = training[field].details;
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
    
    // Update the training field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedTraining = await Training.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
