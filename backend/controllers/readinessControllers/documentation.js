const Documentation = require("../../models/readiness/DocumentationModel");
const Validation = require("../../models/readiness/ValidationModel");
const mongoose = require("mongoose");

// Define fields that have validation details
const documentationFields = [
  "workStandardsInPlace",
  "polyvalenceMatrixUpdated",
  "gaugesAvailable",
  "qualityFileApproved",
  "drpUpdated",
];

// **Create a new Documentation entry**
exports.createDocumentation = async (req, res) => {
  try {
    console.log("📢 Received Documentation Data:", JSON.stringify(req.body, null, 2));

    const documentationData = req.body;

    // ✅ Step 1: Create validation records separately
    const validationPromises = documentationFields.map(async (field) => {
      if (documentationData[field]?.details) {
        const newValidation = new Validation(documentationData[field].details);
        await newValidation.save();
        return newValidation._id;
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Format documentation data with validation _ids
    const formattedDocumentationData = documentationFields.reduce((acc, field, index) => {
      acc[field] = {
        value: documentationData[field]?.value ?? false,
        details: createdValidationIds[index] || null,
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Documentation entry
    const newDocumentation = new Documentation(formattedDocumentationData);
    await newDocumentation.save();

    console.log("✅ Documentation created successfully:", newDocumentation);

    res.status(201).json({ message: "Documentation created successfully", data: newDocumentation });
  } catch (error) {
    console.error("❌ Error creating Documentation:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Get All Documentation Entries with Validations**
exports.getAllDocumentations = async (req, res) => {
  try {
    console.log("📢 Fetching all Documentation records...");

    const documentations = await Documentation.find().populate({
      path: documentationFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log(`✅ Successfully fetched ${documentations.length} Documentation records.`);

    res.status(200).json(documentations);
  } catch (error) {
    console.error("❌ Error fetching Documentation records:", error.message);
    res.status(500).json({ message: "Error fetching Documentation records", error: error.message });
  }
};

// **Get a Single Documentation by ID**
exports.getDocumentationById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Documentation for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Documentation ID format." });
    }

    const documentation = await Documentation.findById(id)
      .populate({
        path: documentationFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!documentation) {
      return res.status(404).json({ message: "Documentation not found." });
    }

    res.status(200).json(documentation);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Update Documentation and Validations**
exports.updateDocumentation = async (req, res) => {
  try {
    const documentationData = req.body;
    const documentationId = req.params.id;

    const existingDocumentation = await Documentation.findById(documentationId);
    if (!existingDocumentation) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    // Step 1: Update documentation fields dynamically
    documentationFields.forEach((field) => {
      existingDocumentation[field].value = documentationData[field]?.value ?? false;
    });

    await existingDocumentation.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      documentationFields.map(async (field) => {
        if (documentationData[field]?.details) {
          if (existingDocumentation[field].details) {
            await Validation.findByIdAndUpdate(existingDocumentation[field].details, documentationData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(documentationData[field].details);
            existingDocumentation[field].details = newValidation._id;
            await existingDocumentation.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Documentation and Validations updated", data: existingDocumentation });
  } catch (error) {
    res.status(500).json({ message: "Error updating Documentation", error: error.message });
  }
};

// **Delete Documentation and Associated Validations**
exports.deleteDocumentation = async (req, res) => {
  try {
    const documentation = await Documentation.findById(req.params.id);
    if (!documentation) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    // Step 1: Delete associated validation records
    const validationIds = documentationFields.map((field) => documentation[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Documentation record
    await Documentation.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Documentation and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Documentation", error: error.message });
  }
};

// **Update Validation for a Specific Field**
exports.updateValidationField = async (req, res) => {
  try {
    const { id, field } = req.params;
    const { value, validationData } = req.body;

    console.log(`📢 Updating validation for Documentation ID: ${id}, Field: ${field}`);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Documentation ID format." });
    }

    const documentation = await Documentation.findById(id);
    if (!documentation) {
      return res.status(404).json({ message: "Documentation not found." });
    }

    if (!documentationFields.includes(field)) {
      return res.status(400).json({ message: `Field '${field}' is not valid for Documentation.` });
    }

    // Step 1: Create or Update Validation Details
    let validationId = documentation[field].details;
    let validation;

    if (validationData) {
      if (validationId) {
        validation = await Validation.findByIdAndUpdate(validationId, validationData, {
          new: true,
          runValidators: true,
        });
      } else {
        validation = new Validation(validationData);
        await validation.save();
        validationId = validation._id;
      }
    }

    // Step 2: Update the Documentation field
    documentation[field].value = value;
    if (validationId) {
      documentation[field].details = validationId;
    }

    await documentation.save();

    console.log(`✅ Updated field '${field}' successfully.`);

    res.status(200).json({ message: "Validation updated successfully", data: documentation });
  } catch (error) {
    console.error("❌ Error updating validation:", error.message);
    res.status(400).json({ message: "Error updating validation", error: error.message });
  }
};
