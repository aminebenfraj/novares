const ProductProcess = require('../../models/readiness/ProductProcessModel');
const Validation = require('../../models/readiness/ValidationModel');

// Get all product processes
exports.getAllProductProcesses = async (req, res) => {
  try {
    const productProcesses = await ProductProcess.find()
      .populate({
        path: 'technicalReview.details dfmea.details pfmea.details injectionTools.details paintingProcess.details assyMachine.details checkingFixture.details industrialCapacity.details skillsDeployment.details',
        model: 'Validation'
      });
    res.status(200).json(productProcesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product process by ID
exports.getProductProcessById = async (req, res) => {
  try {
    const productProcess = await ProductProcess.findById(req.params.id)
      .populate({
        path: 'technicalReview.details dfmea.details pfmea.details injectionTools.details paintingProcess.details assyMachine.details checkingFixture.details industrialCapacity.details skillsDeployment.details',
        model: 'Validation'
      });
    if (!productProcess) {
      return res.status(404).json({ message: 'Product process not found' });
    }
    res.status(200).json(productProcess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product process
exports.createProductProcess = async (req, res) => {
  try {
    const productProcess = new ProductProcess(req.body);
    const newProductProcess = await productProcess.save();
    res.status(201).json(newProductProcess);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product process
exports.updateProductProcess = async (req, res) => {
  try {
    const productProcess = await ProductProcess.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!productProcess) {
      return res.status(404).json({ message: 'Product process not found' });
    }
    res.status(200).json(productProcess);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product process
exports.deleteProductProcess = async (req, res) => {
  try {
    const productProcess = await ProductProcess.findByIdAndDelete(req.params.id);
    if (!productProcess) {
      return res.status(404).json({ message: 'Product process not found' });
    }
    res.status(200).json({ message: 'Product process deleted successfully' });
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
    const productProcess = await ProductProcess.findById(id);
    if (!productProcess) {
      return res.status(404).json({ message: 'Product process not found' });
    }
    
    if (!productProcess[field]) {
      return res.status(400).json({ message: `Field ${field} does not exist` });
    }
    
    // Create or update validation details
    let validationId = productProcess[field].details;
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
    
    // Update the product process field
    const update = {};
    update[`${field}.value`] = value;
    if (validationId) {
      update[`${field}.details`] = validationId;
    }
    
    const updatedProductProcess = await ProductProcess.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate(`${field}.details`);
    
    res.status(200).json(updatedProductProcess);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
