const Supplier = require('../../models/readiness/SuppliersModel');
const Validation = require('../../models/readiness/ValidationModel');

const supplierFields = [
  "componentsRawMaterialAvailable",
  "packagingDefined",
  "partsAccepted",
  "purchasingRedFilesTransferred",
  "automaticProcurementEnabled"
];

exports.createSupplier = async (req, res) => {
  try {
    console.log("📢 Received Supplier Data:", JSON.stringify(req.body, null, 2));

    const supplierData = req.body;

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = supplierFields.map(async (field) => {
      if (supplierData[field]?.details) {
        const newValidation = new Validation(supplierData[field].details);
        await newValidation.save();
        return newValidation._id; // Return the validation _id
      }
      return null;
    });

    const createdValidationIds = await Promise.all(validationPromises);

    // ✅ Step 2: Build the Supplier object with validation _ids
    const formattedSupplierData = supplierFields.reduce((acc, field, index) => {
      acc[field] = {
        value: supplierData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Supplier entry
    const newSupplier = new Supplier(formattedSupplierData);
    await newSupplier.save();

    console.log("✅ Supplier created successfully:", newSupplier);

    res.status(201).json({
      message: "Supplier created successfully",
      data: newSupplier,
    });

  } catch (error) {
    console.error("❌ Error creating Supplier:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all suppliers with validations
exports.getAllSuppliers = async (req, res) => {
  try {
    console.log("📢 Fetching all Suppliers...");

    const suppliers = await Supplier.find().populate({
      path: supplierFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    });

    console.log("✅ Suppliers fetched successfully:", suppliers);

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("❌ Error fetching Suppliers:", error.message);
    res.status(500).json({ message: "Error fetching Suppliers", error: error.message });
  }
};

// Get a single supplier by ID with validations
const mongoose = require("mongoose");

exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Supplier for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Supplier ID format." });
    }

    const supplier = await Supplier.findById(id)
      .populate({
        path: supplierFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean();

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Supplier and Validations
exports.updateSupplier = async (req, res) => {
  try {
    const supplierData = req.body;
    const supplierId = req.params.id;

    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Step 1: Update supplier fields dynamically
    supplierFields.forEach((field) => {
      existingSupplier[field].value = supplierData[field]?.value ?? false;
    });

    await existingSupplier.save();

    // Step 2: Update Validations dynamically
    await Promise.all(
      supplierFields.map(async (field) => {
        if (supplierData[field]?.details) {
          if (existingSupplier[field].details) {
            await Validation.findByIdAndUpdate(existingSupplier[field].details, supplierData[field].details, {
              new: true,
            });
          } else {
            const newValidation = await Validation.create(supplierData[field].details);
            existingSupplier[field].details = newValidation._id;
            await existingSupplier.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Supplier and Validations updated", data: existingSupplier });
  } catch (error) {
    res.status(500).json({ message: "Error updating Supplier", error: error.message });
  }
};

// Delete Supplier and Associated Validations
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Step 1: Delete the associated validations
    const validationIds = supplierFields.map((field) => supplier[field]?.details).filter(Boolean);
    await Validation.deleteMany({ _id: { $in: validationIds } });

    // Step 2: Delete the Supplier record itself
    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Supplier and associated validations deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Supplier", error: error.message });
  }
};