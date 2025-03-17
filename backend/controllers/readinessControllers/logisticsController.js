const Logistics = require("../../models/readiness/LogisticsModel");
const Validation = require("../../models/readiness/ValidationModel");
const mongoose = require("mongoose");

// Define logistics fields with validation details
const logisticsFields = [
  "loopsFlowsDefined",
  "storageDefined",
  "labelsCreated",
  "sapReferenced",
  "safetyStockReady",
];

// **Create a new Logistics entry**
exports.createLogistics = async (req, res) => {
  try {
    console.log("📢 Received Logistics Data:", JSON.stringify(req.body, null, 2));
    const logisticsData = req.body;

    // ✅ Step 1: Create validation records separately
    const validationPromises = logisticsFields.map(async (field) => {
      if (logisticsData[field]?.details) {
        const newValidation = new Validation(logisticsData[field].details);
        await newValidation.save();
        return newValidation._id;
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Format logistics data with validation _ids
    const formattedLogisticsData = logisticsFields.reduce((acc, field, index) => {
      acc[field] = {
        value: logisticsData[field]?.value ?? false,
        details: createdValidationIds[index] || null,
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Logistics entry
    const newLogistics = new Logistics(formattedLogisticsData);
    await newLogistics.save();

    console.log("✅ Logistics created successfully:", newLogistics);
    res.status(201).json({ message: "Logistics created successfully", data: newLogistics });
  } catch (error) {
    console.error("❌ Error creating Logistics:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Get All Logistics Entries with Validations**
exports.getAllLogistics = async (req, res) => {
  try {
    console.log("📢 Fetching all Logistics records...");

    const logistics = await Logistics.find().populate({
      path: logisticsFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log(`✅ Successfully fetched ${logistics.length} Logistics records.`);
    res.status(200).json(logistics);
  } catch (error) {
    console.error("❌ Error fetching Logistics records:", error.message);
    res.status(500).json({ message: "Error fetching Logistics records", error: error.message });
  }
};

// **Get a Single Logistics Entry by ID**
exports.getLogisticsById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📢 Fetching Logistics for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Logistics ID format." });
    }

    const logistics = await Logistics.findById(id).populate({
      path: logisticsFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    if (!logistics) {
      return res.status(404).json({ message: "Logistics not found." });
    }

    res.status(200).json(logistics);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Update Logistics and Validations**
exports.updateLogistics = async (req, res) => {
  try {
    const { id } = req.params;
    const logisticsData = req.body;

    const existingLogistics = await Logistics.findById(id);
    if (!existingLogistics) {
      return res.status(404).json({ message: "Logistics not found" });
    }

    // Step 1: Update logistics fields dynamically
    logisticsFields.forEach((field) => {
      existingLogistics[field].value = logisticsData[field]?.value ?? false;
    });

    await existingLogistics.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      logisticsFields.map(async (field) => {
        if (logisticsData[field]?.details) {
          if (existingLogistics[field].details) {
            await Validation.findByIdAndUpdate(existingLogistics[field].details, logisticsData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(logisticsData[field].details);
            existingLogistics[field].details = newValidation._id;
            await existingLogistics.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Logistics and Validations updated", data: existingLogistics });
  } catch (error) {
    res.status(500).json({ message: "Error updating Logistics", error: error.message });
  }
};

// **Delete Logistics and Associated Validations**
exports.deleteLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.findById(req.params.id);
    if (!logistics) {
      return res.status(404).json({ message: "Logistics not found" });
    }

    // Step 1: Delete associated validation records
    const validationIds = logisticsFields.map((field) => logistics[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Logistics record
    await Logistics.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Logistics and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Logistics", error: error.message });
  }
};