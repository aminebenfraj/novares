const Training = require('../../models/readiness/TrainingModel');
const Validation = require('../../models/readiness/ValidationModel');

const trainingFields = [
  "visualControlQualification",
  "dojoTrainingCompleted",
  "trainingPlanDefined"
];

exports.createTraining = async (req, res) => {
  try {
    console.log("📢 Received Training Data:", JSON.stringify(req.body, null, 2));

    const trainingData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = trainingFields.map(async (field) => {
      if (trainingData[field]?.details) {
        const newValidation = new Validation(trainingData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Training object with validation _ids
    const formattedTrainingData = trainingFields.reduce((acc, field, index) => {
      acc[field] = {
        value: trainingData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Training entry
    const newTraining = new Training(formattedTrainingData);
    await newTraining.save();

    console.log("✅ Training created successfully:", newTraining);

    res.status(201).json({
      message: "Training created successfully",
      data: newTraining,
    });

  } catch (error) {
    console.error("❌ Error creating Training:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all training records with validations
exports.getAllTrainings = async (req, res) => {
  try {
    console.log("📢 Fetching all Training records...");

    const trainings = await Training.find().populate({
      path: trainingFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Training records fetched successfully:", trainings);

    res.status(200).json(trainings);
  } catch (error) {
    console.error("❌ Error fetching Training records:", error.message);
    res.status(500).json({ message: "Error fetching Training records", error: error.message });
  }
};

// Get a single training by ID with validations
const mongoose = require("mongoose");

exports.getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Training for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Training ID format." });
    }

    const training = await Training.findById(id)
      .populate({
        path: trainingFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!training) {
      return res.status(404).json({ message: "Training not found." });
    }

    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Training and Validations
exports.updateTraining = async (req, res) => {
  try {
    const trainingData = req.body;
    const trainingId = req.params.id;

    const existingTraining = await Training.findById(trainingId);
    if (!existingTraining) {
      return res.status(404).json({ message: "Training not found" });
    }

    // Step 1: Update training fields dynamically
    trainingFields.forEach((field) => {
      existingTraining[field].value = trainingData[field]?.value ?? false;
    });

    await existingTraining.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      trainingFields.map(async (field) => {
        if (trainingData[field]?.details) {
          if (existingTraining[field].details) {
            await Validation.findByIdAndUpdate(existingTraining[field].details, trainingData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(trainingData[field].details);
            existingTraining[field].details = newValidation._id;
            await existingTraining.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Training and Validations updated", data: existingTraining });
  } catch (error) {
    res.status(500).json({ message: "Error updating Training", error: error.message });
  }
};

// Delete Training and Associated Validations
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = trainingFields.map((field) => training[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Training record itself
    await Training.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Training and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Training", error: error.message });
  }
};