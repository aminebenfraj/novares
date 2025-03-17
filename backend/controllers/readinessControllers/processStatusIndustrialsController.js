const ProcessStatusIndustrials = require('../../models/readiness/ProcessStatusIndustrialsModel');
const Validation = require('../../models/readiness/ValidationModel');

const processStatusIndustrialsFields = [
  "processComplete",
  "processParametersIdentified",
  "pokaYokesIdentifiedAndEffective",
  "specificBoundaryPartsSamples",
  "gaugesAcceptedByPlant",
  "processCapabilitiesPerformed",
  "pfmeaIssuesAddressed",
  "reversePfmeaPerformed",
  "industrialMeansAccepted"
];

exports.createProcessStatusIndustrials = async (req, res) => {
  try {
    console.log("📢 Received Process Status Industrials Data:", JSON.stringify(req.body, null, 2));

    const processStatusIndustrialsData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = processStatusIndustrialsFields.map(async (field) => {
      if (processStatusIndustrialsData[field]?.details) {
        const newValidation = new Validation(processStatusIndustrialsData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Process Status Industrials object with validation _ids
    const formattedProcessStatusIndustrialsData = processStatusIndustrialsFields.reduce((acc, field, index) => {
      acc[field] = {
        value: processStatusIndustrialsData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Process Status Industrials entry
    const newProcessStatusIndustrials = new ProcessStatusIndustrials(formattedProcessStatusIndustrialsData);
    await newProcessStatusIndustrials.save();

    console.log("✅ Process Status Industrials created successfully:", newProcessStatusIndustrials);

    res.status(201).json({
      message: "Process Status Industrials created successfully",
      data: newProcessStatusIndustrials,
    });

  } catch (error) {
    console.error("❌ Error creating Process Status Industrials:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all process status industrials records with validations
exports.getAllProcessStatusIndustrials = async (req, res) => {
  try {
    console.log("📢 Fetching all Process Status Industrials records...");

    const processStatusIndustrials = await ProcessStatusIndustrials.find().populate({
      path: processStatusIndustrialsFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Process Status Industrials records fetched successfully:", processStatusIndustrials);

    res.status(200).json(processStatusIndustrials);
  } catch (error) {
    console.error("❌ Error fetching Process Status Industrials records:", error.message);
    res.status(500).json({ message: "Error fetching Process Status Industrials records", error: error.message });
  }
};

// Get a single process status industrials by ID with validations
const mongoose = require("mongoose");

exports.getProcessStatusIndustrialsById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Process Status Industrials for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Process Status Industrials ID format." });
    }

    const processStatusIndustrials = await ProcessStatusIndustrials.findById(id)
      .populate({
        path: processStatusIndustrialsFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!processStatusIndustrials) {
      return res.status(404).json({ message: "Process Status Industrials not found." });
    }

    res.status(200).json(processStatusIndustrials);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Process Status Industrials and Validations
exports.updateProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrialsData = req.body;
    const processStatusIndustrialsId = req.params.id;

    const existingProcessStatusIndustrials = await ProcessStatusIndustrials.findById(processStatusIndustrialsId);
    if (!existingProcessStatusIndustrials) {
      return res.status(404).json({ message: "Process Status Industrials not found" });
    }

    // Step 1: Update process status industrials fields dynamically
    processStatusIndustrialsFields.forEach((field) => {
      existingProcessStatusIndustrials[field].value = processStatusIndustrialsData[field]?.value ?? false;
    });

    await existingProcessStatusIndustrials.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      processStatusIndustrialsFields.map(async (field) => {
        if (processStatusIndustrialsData[field]?.details) {
          if (existingProcessStatusIndustrials[field].details) {
            await Validation.findByIdAndUpdate(existingProcessStatusIndustrials[field].details, processStatusIndustrialsData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(processStatusIndustrialsData[field].details);
            existingProcessStatusIndustrials[field].details = newValidation._id;
            await existingProcessStatusIndustrials.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Process Status Industrials and Validations updated", data: existingProcessStatusIndustrials });
  } catch (error) {
    res.status(500).json({ message: "Error updating Process Status Industrials", error: error.message });
  }
};

// Delete Process Status Industrials and Associated Validations
exports.deleteProcessStatusIndustrials = async (req, res) => {
  try {
    const processStatusIndustrials = await ProcessStatusIndustrials.findById(req.params.id);
    if (!processStatusIndustrials) {
      return res.status(404).json({ message: "Process Status Industrials not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = processStatusIndustrialsFields.map((field) => processStatusIndustrials[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Process Status Industrials record itself
    await ProcessStatusIndustrials.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Process Status Industrials and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Process Status Industrials", error: error.message });
  }
};