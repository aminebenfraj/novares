const RunAtRateProduction = require('../../models/readiness/RunAtRateProductionModel');
const Validation = require('../../models/readiness/ValidationModel');

const runAtRateProductionFields = [
  "qualityWallInPlace",
  "selfRunRatePerformed",
  "dimensionalInspectionsConform",
  "rampUpDefined",
  "mppAuditCompleted",
  "reversePFMEACompleted",
  "paceBoardFollowUp"
];

exports.createRunAtRateProduction = async (req, res) => {
  try {
    console.log("📢 Received Run-at-Rate Production Data:", JSON.stringify(req.body, null, 2));

    const runAtRateProductionData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = runAtRateProductionFields.map(async (field) => {
      if (runAtRateProductionData[field]?.details) {
        const newValidation = new Validation(runAtRateProductionData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Run-at-Rate Production object with validation _ids
    const formattedRunAtRateProductionData = runAtRateProductionFields.reduce((acc, field, index) => {
      acc[field] = {
        value: runAtRateProductionData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Run-at-Rate Production entry
    const newRunAtRateProduction = new RunAtRateProduction(formattedRunAtRateProductionData);
    await newRunAtRateProduction.save();

    console.log("✅ Run-at-Rate Production created successfully:", newRunAtRateProduction);

    res.status(201).json({
      message: "Run-at-Rate Production created successfully",
      data: newRunAtRateProduction,
    });

  } catch (error) {
    console.error("❌ Error creating Run-at-Rate Production:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all run-at-rate production records with validations
exports.getAllRunAtRateProductions = async (req, res) => {
  try {
    console.log("📢 Fetching all Run-at-Rate Production records...");

    const runAtRateProductions = await RunAtRateProduction.find().populate({
      path: runAtRateProductionFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Run-at-Rate Production records fetched successfully:", runAtRateProductions);

    res.status(200).json(runAtRateProductions);
  } catch (error) {
    console.error("❌ Error fetching Run-at-Rate Production records:", error.message);
    res.status(500).json({ message: "Error fetching Run-at-Rate Production records", error: error.message });
  }
};

// Get a single run-at-rate production by ID with validations
const mongoose = require("mongoose");

exports.getRunAtRateProductionById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Run-at-Rate Production for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Run-at-Rate Production ID format." });
    }

    const runAtRateProduction = await RunAtRateProduction.findById(id)
      .populate({
        path: runAtRateProductionFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!runAtRateProduction) {
      return res.status(404).json({ message: "Run-at-Rate Production not found." });
    }

    res.status(200).json(runAtRateProduction);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Run-at-Rate Production and Validations
exports.updateRunAtRateProduction = async (req, res) => {
  try {
    const runAtRateProductionData = req.body;
    const runAtRateProductionId = req.params.id;

    const existingRunAtRateProduction = await RunAtRateProduction.findById(runAtRateProductionId);
    if (!existingRunAtRateProduction) {
      return res.status(404).json({ message: "Run-at-Rate Production not found" });
    }

    // Step 1: Update run-at-rate production fields dynamically
    runAtRateProductionFields.forEach((field) => {
      existingRunAtRateProduction[field].value = runAtRateProductionData[field]?.value ?? false;
    });

    await existingRunAtRateProduction.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      runAtRateProductionFields.map(async (field) => {
        if (runAtRateProductionData[field]?.details) {
          if (existingRunAtRateProduction[field].details) {
            await Validation.findByIdAndUpdate(existingRunAtRateProduction[field].details, runAtRateProductionData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(runAtRateProductionData[field].details);
            existingRunAtRateProduction[field].details = newValidation._id;
            await existingRunAtRateProduction.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Run-at-Rate Production and Validations updated", data: existingRunAtRateProduction });
  } catch (error) {
    res.status(500).json({ message: "Error updating Run-at-Rate Production", error: error.message });
  }
};

// Delete Run-at-Rate Production and Associated Validations
exports.deleteRunAtRateProduction = async (req, res) => {
  try {
    const runAtRateProduction = await RunAtRateProduction.findById(req.params.id);
    if (!runAtRateProduction) {
      return res.status(404).json({ message: "Run-at-Rate Production not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = runAtRateProductionFields.map((field) => runAtRateProduction[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Run-at-Rate Production record itself
    await RunAtRateProduction.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Run-at-Rate Production and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Run-at-Rate Production", error: error.message });
  }
};