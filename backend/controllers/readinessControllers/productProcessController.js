const ProductProcess = require('../../models/readiness/ProductProcessModel');
const Validation = require('../../models/readiness/ValidationModel');

const productProcessFields = [
  "technicalReview",
  "dfmea",
  "pfmea",
  "injectionTools",
  "paintingProcess",
  "assyMachine",
  "checkingFixture",
  "industrialCapacity",
  "skillsDeployment"
];

exports.createProductProcess = async (req, res) => {
  try {
    console.log("📢 Received Product Process Data:", JSON.stringify(req.body, null, 2));

    const productProcessData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = productProcessFields.map(async (field) => {
      if (productProcessData[field]?.details) {
        const newValidation = new Validation(productProcessData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Product Process object with validation _ids
    const formattedProductProcessData = productProcessFields.reduce((acc, field, index) => {
      acc[field] = {
        value: productProcessData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Product Process entry
    const newProductProcess = new ProductProcess(formattedProductProcessData);
    await newProductProcess.save();

    console.log("✅ Product Process created successfully:", newProductProcess);

    res.status(201).json({
      message: "Product Process created successfully",
      data: newProductProcess,
    });

  } catch (error) {
    console.error("❌ Error creating Product Process:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all product process records with validations
exports.getAllProductProcesses = async (req, res) => {
  try {
    console.log("📢 Fetching all Product Process records...");

    const productProcesses = await ProductProcess.find().populate({
      path: productProcessFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Product Process records fetched successfully:", productProcesses);

    res.status(200).json(productProcesses);
  } catch (error) {
    console.error("❌ Error fetching Product Process records:", error.message);
    res.status(500).json({ message: "Error fetching Product Process records", error: error.message });
  }
};

// Get a single product process by ID with validations
const mongoose = require("mongoose");

exports.getProductProcessById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Product Process for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product Process ID format." });
    }

    const productProcess = await ProductProcess.findById(id)
      .populate({
        path: productProcessFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!productProcess) {
      return res.status(404).json({ message: "Product Process not found." });
    }

    res.status(200).json(productProcess);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Product Process and Validations
exports.updateProductProcess = async (req, res) => {
  try {
    const productProcessData = req.body;
    const productProcessId = req.params.id;

    const existingProductProcess = await ProductProcess.findById(productProcessId);
    if (!existingProductProcess) {
      return res.status(404).json({ message: "Product Process not found" });
    }

    // Step 1: Update product process fields dynamically
    productProcessFields.forEach((field) => {
      existingProductProcess[field].value = productProcessData[field]?.value ?? false;
    });

    await existingProductProcess.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      productProcessFields.map(async (field) => {
        if (productProcessData[field]?.details) {
          if (existingProductProcess[field].details) {
            await Validation.findByIdAndUpdate(existingProductProcess[field].details, productProcessData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(productProcessData[field].details);
            existingProductProcess[field].details = newValidation._id;
            await existingProductProcess.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Product Process and Validations updated", data: existingProductProcess });
  } catch (error) {
    res.status(500).json({ message: "Error updating Product Process", error: error.message });
  }
};

// Delete Product Process and Associated Validations
exports.deleteProductProcess = async (req, res) => {
  try {
    const productProcess = await ProductProcess.findById(req.params.id);
    if (!productProcess) {
      return res.status(404).json({ message: "Product Process not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = productProcessFields.map((field) => productProcess[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Product Process record itself
    await ProductProcess.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product Process and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Product Process", error: error.message });
  }
};