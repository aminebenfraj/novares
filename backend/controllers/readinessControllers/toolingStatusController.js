const ToolingStatus = require('../../models/readiness/ToolingStatusModel');
const Validation = require('../../models/readiness/ValidationModel');

const toolingStatusFields = [
  "manufacturedPartsAtLastRelease",
  "specificationsConformity",
  "partsGrainedAndValidated",
  "noBreakOrIncidentDuringInjectionTrials",
  "toolsAccepted",
  "preSerialInjectionParametersDefined",
  "serialProductionInjectionParametersDefined",
  "incompletePartsProduced",
  "toolmakerIssuesEradicated",
];

exports.createToolingStatus = async (req, res) => {
  try {
    console.log("📢 Received Tooling Status Data:", JSON.stringify(req.body, null, 2));

    const toolingStatusData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = toolingStatusFields.map(async (field) => {
      if (toolingStatusData[field]?.details) {
        const newValidation = new Validation(toolingStatusData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Tooling Status object with validation _ids
    const formattedToolingStatusData = toolingStatusFields.reduce((acc, field, index) => {
      acc[field] = {
        value: toolingStatusData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Tooling Status entry
    const newToolingStatus = new ToolingStatus(formattedToolingStatusData);
    await newToolingStatus.save();

    console.log("✅ Tooling Status created successfully:", newToolingStatus);

    res.status(201).json({
      message: "Tooling Status created successfully",
      data: newToolingStatus,
    });

  } catch (error) {
    console.error("❌ Error creating Tooling Status:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all tooling status records with validations
exports.getAllToolingStatuses = async (req, res) => {
  try {
    console.log("📢 Fetching all Tooling Status records...");

    const toolingStatuses = await ToolingStatus.find().populate({
      path: toolingStatusFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Tooling Status records fetched successfully:", toolingStatuses);

    res.status(200).json(toolingStatuses);
  } catch (error) {
    console.error("❌ Error fetching Tooling Status records:", error.message);
    res.status(500).json({ message: "Error fetching Tooling Status records", error: error.message });
  }
};

// Get a single tooling status by ID with validations
const mongoose = require("mongoose");

exports.getToolingStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Tooling Status for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tooling Status ID format." });
    }

    const toolingStatus = await ToolingStatus.findById(id)
      .populate({
        path: toolingStatusFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!toolingStatus) {
      return res.status(404).json({ message: "Tooling Status not found." });
    }

    res.status(200).json(toolingStatus);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Tooling Status and Validations
exports.updateToolingStatus = async (req, res) => {
  try {
    const toolingStatusData = req.body;
    const toolingStatusId = req.params.id;

    const existingToolingStatus = await ToolingStatus.findById(toolingStatusId);
    if (!existingToolingStatus) {
      return res.status(404).json({ message: "Tooling Status not found" });
    }

    // Step 1: Update tooling status fields dynamically
    toolingStatusFields.forEach((field) => {
      existingToolingStatus[field].value = toolingStatusData[field]?.value ?? false;
    });

    await existingToolingStatus.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      toolingStatusFields.map(async (field) => {
        if (toolingStatusData[field]?.details) {
          if (existingToolingStatus[field].details) {
            await Validation.findByIdAndUpdate(existingToolingStatus[field].details, toolingStatusData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(toolingStatusData[field].details);
            existingToolingStatus[field].details = newValidation._id;
            await existingToolingStatus.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Tooling Status and Validations updated", data: existingToolingStatus });
  } catch (error) {
    res.status(500).json({ message: "Error updating Tooling Status", error: error.message });
  }
};

// Delete Tooling Status and Associated Validations
exports.deleteToolingStatus = async (req, res) => {
  try {
    const toolingStatus = await ToolingStatus.findById(req.params.id);
    if (!toolingStatus) {
      return res.status(404).json({ message: "Tooling Status not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = toolingStatusFields.map((field) => toolingStatus[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Tooling Status record itself
    await ToolingStatus.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Tooling Status and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Tooling Status", error: error.message });
  }
};