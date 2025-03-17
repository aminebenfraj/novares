const Maintenance = require('../../models/readiness/MaintenanceModel');
const Validation = require('../../models/readiness/ValidationModel');

const maintenanceFields = [
  "sparePartsIdentifiedAndAvailable",
  "processIntegratedInPlantMaintenance",
  "maintenanceStaffTrained"
];

exports.createMaintenance = async (req, res) => {
  try {
    console.log("📢 Received Maintenance Data:", JSON.stringify(req.body, null, 2));

    const maintenanceData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = maintenanceFields.map(async (field) => {
      if (maintenanceData[field]?.details) {
        const newValidation = new Validation(maintenanceData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Maintenance object with validation _ids
    const formattedMaintenanceData = maintenanceFields.reduce((acc, field, index) => {
      acc[field] = {
        value: maintenanceData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Maintenance entry
    const newMaintenance = new Maintenance(formattedMaintenanceData);
    await newMaintenance.save();

    console.log("✅ Maintenance created successfully:", newMaintenance);

    res.status(201).json({
      message: "Maintenance created successfully",
      data: newMaintenance,
    });

  } catch (error) {
    console.error("❌ Error creating Maintenance:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all maintenance records with validations
exports.getAllMaintenances = async (req, res) => {
  try {
    console.log("📢 Fetching all Maintenance records...");

    const maintenances = await Maintenance.find().populate({
      path: maintenanceFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Maintenance records fetched successfully:", maintenances);

    res.status(200).json(maintenances);
  } catch (error) {
    console.error("❌ Error fetching Maintenance records:", error.message);
    res.status(500).json({ message: "Error fetching Maintenance records", error: error.message });
  }
};

// Get a single maintenance by ID with validations
const mongoose = require("mongoose");

exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Maintenance for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Maintenance ID format." });
    }

    const maintenance = await Maintenance.findById(id)
      .populate({
        path: maintenanceFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found." });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Maintenance and Validations
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenanceData = req.body;
    const maintenanceId = req.params.id;

    const existingMaintenance = await Maintenance.findById(maintenanceId);
    if (!existingMaintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    // Step 1: Update maintenance fields dynamically
    maintenanceFields.forEach((field) => {
      existingMaintenance[field].value = maintenanceData[field]?.value ?? false;
    });

    await existingMaintenance.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      maintenanceFields.map(async (field) => {
        if (maintenanceData[field]?.details) {
          if (existingMaintenance[field].details) {
            await Validation.findByIdAndUpdate(existingMaintenance[field].details, maintenanceData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(maintenanceData[field].details);
            existingMaintenance[field].details = newValidation._id;
            await existingMaintenance.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Maintenance and Validations updated", data: existingMaintenance });
  } catch (error) {
    res.status(500).json({ message: "Error updating Maintenance", error: error.message });
  }
};

// Delete Maintenance and Associated Validations
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = maintenanceFields.map((field) => maintenance[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Maintenance record itself
    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Maintenance and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Maintenance", error: error.message });
  }
};