const Packaging = require('../../models/readiness/PackagingModel');
const Validation = require('../../models/readiness/ValidationModel');

const packagingFields = [
  "customerDefined",
  "returnableLoops",
  "smallBatchSubstitute",
  "rampUpReady"
];

exports.createPackaging = async (req, res) => {
  try {
    console.log("📢 Received Packaging Data:", JSON.stringify(req.body, null, 2));

    const packagingData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = packagingFields.map(async (field) => {
      if (packagingData[field]?.details) {
        const newValidation = new Validation(packagingData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Packaging object with validation _ids
    const formattedPackagingData = packagingFields.reduce((acc, field, index) => {
      acc[field] = {
        value: packagingData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Packaging entry
    const newPackaging = new Packaging(formattedPackagingData);
    await newPackaging.save();

    console.log("✅ Packaging created successfully:", newPackaging);

    res.status(201).json({
      message: "Packaging created successfully",
      data: newPackaging,
    });

  } catch (error) {
    console.error("❌ Error creating Packaging:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all packaging records with validations
exports.getAllPackagings = async (req, res) => {
  try {
    console.log("📢 Fetching all Packaging records...");

    const packagings = await Packaging.find().populate({
      path: packagingFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Packaging records fetched successfully:", packagings);

    res.status(200).json(packagings);
  } catch (error) {
    console.error("❌ Error fetching Packaging records:", error.message);
    res.status(500).json({ message: "Error fetching Packaging records", error: error.message });
  }
};

// Get a single packaging by ID with validations
const mongoose = require("mongoose");

exports.getPackagingById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Packaging for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Packaging ID format." });
    }

    const packaging = await Packaging.findById(id)
      .populate({
        path: packagingFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!packaging) {
      return res.status(404).json({ message: "Packaging not found." });
    }

    res.status(200).json(packaging);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Packaging and Validations
exports.updatePackaging = async (req, res) => {
  try {
    const packagingData = req.body;
    const packagingId = req.params.id;

    const existingPackaging = await Packaging.findById(packagingId);
    if (!existingPackaging) {
      return res.status(404).json({ message: "Packaging not found" });
    }

    // Step 1: Update packaging fields dynamically
    packagingFields.forEach((field) => {
      existingPackaging[field].value = packagingData[field]?.value ?? false;
    });

    await existingPackaging.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      packagingFields.map(async (field) => {
        if (packagingData[field]?.details) {
          if (existingPackaging[field].details) {
            await Validation.findByIdAndUpdate(existingPackaging[field].details, packagingData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(packagingData[field].details);
            existingPackaging[field].details = newValidation._id;
            await existingPackaging.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Packaging and Validations updated", data: existingPackaging });
  } catch (error) {
    res.status(500).json({ message: "Error updating Packaging", error: error.message });
  }
};

// Delete Packaging and Associated Validations
exports.deletePackaging = async (req, res) => {
  try {
    const packaging = await Packaging.findById(req.params.id);
    if (!packaging) {
      return res.status(404).json({ message: "Packaging not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = packagingFields.map((field) => packaging[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Packaging record itself
    await Packaging.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Packaging and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Packaging", error: error.message });
  }
};