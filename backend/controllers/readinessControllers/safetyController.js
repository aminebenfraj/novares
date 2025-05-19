const Safety = require('../../models/readiness/SafetyModel');
const Validation = require('../../models/readiness/ValidationModel');

const safetyFields = [
  "industrialMeansCompliance",
  "teamTraining",
];

exports.createSafety = async (req, res) => {
  try {
    console.log("📢 Received Safety Data:", JSON.stringify(req.body, null, 2));

    const safetyData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = safetyFields.map(async (field) => {
      if (safetyData[field]?.details) {
        const newValidation = new Validation(safetyData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Safety object with validation _ids
    const formattedSafetyData = safetyFields.reduce((acc, field, index) => {
      acc[field] = {
        value: safetyData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Safety entry
    const newSafety = new Safety(formattedSafetyData);
    await newSafety.save();

    console.log("✅ Safety created successfully:", newSafety);

    res.status(201).json({
      message: "Safety created successfully",
      data: newSafety,
    });

  } catch (error) {
    console.error("❌ Error creating Safety:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all safety records with validations
exports.getAllSafeties = async (req, res) => {
  try {
    console.log("📢 Fetching all Safety records...");

    const safeties = await Safety.find().populate({
      path: safetyFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Safety records fetched successfully:", safeties);

    res.status(200).json(safeties);
  } catch (error) {
    console.error("❌ Error fetching Safety records:", error.message);
    res.status(500).json({ message: "Error fetching Safety records", error: error.message });
  }
};

// Get a single safety by ID with validations
const mongoose = require("mongoose");

exports.getSafetyById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Safety for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Safety ID format." });
    }

    const safety = await Safety.findById(id)
      .populate({
        path: safetyFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!safety) {
      return res.status(404).json({ message: "Safety not found." });
    }

    res.status(200).json(safety);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Safety and Validations
exports.updateSafety = async (req, res) => {
  try {
    const safetyData = req.body;
    const safetyId = req.params.id;

    const existingSafety = await Safety.findById(safetyId);
    if (!existingSafety) {
      return res.status(404).json({ message: "Safety not found" });
    }

    // Step 1: Update safety fields dynamically
    safetyFields.forEach((field) => {
      existingSafety[field].value = safetyData[field]?.value ?? false;
    });

    await existingSafety.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      safetyFields.map(async (field) => {
        if (safetyData[field]?.details) {
          if (existingSafety[field].details) {
            await Validation.findByIdAndUpdate(existingSafety[field].details, safetyData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(safetyData[field].details);
            existingSafety[field].details = newValidation._id;
            await existingSafety.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Safety and Validations updated", data: existingSafety });
  } catch (error) {
    res.status(500).json({ message: "Error updating Safety", error: error.message });
  }
};

// Delete Safety and Associated Validations
exports.deleteSafety = async (req, res) => {
  try {
    const safety = await Safety.findById(req.params.id);
    if (!safety) {
      return res.status(404).json({ message: "Safety not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = safetyFields.map((field) => safety[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Safety record itself
    await Safety.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Safety and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Safety", error: error.message });
  }
};