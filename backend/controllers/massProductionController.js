const MassProduction = require("../models/MassProductionModel");
const ProductDesignation = require("../models/ProductDesignationModel");
const User = require("../models/UserModel");

// ✅ Create a new MassProduction entry
exports.createMassProduction = async (req, res) => {
  try {
    const {
      id,
      status,
      status_type,
      project_n,
      product_designation,
      description,
      customer,
      technical_skill,
      initial_request,
      request_original,
      frasability,
      validation_for_offer,
      customer_offer,
      customer_order,
      ok_for_lunch,
      kick_off,
      design,
      facilities,
      p_p_tuning,
      process_qualif,
      ppap_submission_date,
      ppap_submitted,
      closure,
      comment,
      next_review,
      mlo,
      tko,
      cv,
      pt1,
      pt2,
      sop,
    } = req.body;

    // ✅ Ensure customer exists and is a "customer" role
    const customerExists = await User.findById(customer);
    if (!customerExists || customerExists.role !== "customer") {
      return res.status(400).json({ error: "Invalid customer ID or user is not a customer" });
    }

    // ✅ Ensure all product designations exist
    if (!Array.isArray(product_designation)) {
      return res.status(400).json({ error: "Product designation must be an array of IDs" });
    }

    const validProducts = await ProductDesignation.find({ _id: { $in: product_designation } });
    if (validProducts.length !== product_designation.length) {
      return res.status(400).json({ error: "Some product designations are invalid" });
    }

    // ✅ Calculate days until PPAP submission
    let days_until_ppap_submission = null;
    if (ppap_submission_date) {
      const today = new Date();
      const ppapDate = new Date(ppap_submission_date);
      days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24))); // Convert to days
    }

    // ✅ Create new MassProduction entry
    const newMassProduction = new MassProduction({
      id,
      status,
      status_type,
      project_n,
      product_designation,
      description,
      customer,
      technical_skill,
      initial_request,
      request_original,
      frasability,
      validation_for_offer,
      customer_offer,
      customer_order,
      ok_for_lunch,
      kick_off,
      design,
      facilities,
      p_p_tuning,
      process_qualif,
      ppap_submission_date,
      ppap_submitted,
      closure,
      comment,
      next_review,
      mlo,
      tko,
      cv,
      pt1,
      pt2,
      sop,
      days_until_ppap_submission, // ✅ Include computed field
    });

    await newMassProduction.save();
    res.status(201).json(newMassProduction);
  } catch (error) {
    console.error("❌ Error creating MassProduction:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get all MassProduction entries (with filtering, pagination)
exports.getAllMassProductions = async (req, res) => {
  try {
    const { status, customer, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;

    const massProductions = await MassProduction.find(filter)
      .populate("customer", "username email")
      .populate("product_designation", "part_name reference")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(massProductions);
  } catch (error) {
    console.error("❌ Error fetching MassProduction:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get a single MassProduction by ID
exports.getMassProductionById = async (req, res) => {
  try {
    const massProduction = await MassProduction.findById(req.params.id)
      .populate("customer", "username email")
      .populate("product_designation", "part_name reference");

    if (!massProduction) {
      return res.status(404).json({ error: "MassProduction not found" });
    }

    res.json(massProduction);
  } catch (error) {
    console.error("❌ Error fetching MassProduction by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update a MassProduction entry
exports.updateMassProduction = async (req, res) => {
  try {
    let updatedData = req.body;

    // ✅ Ensure customer exists if updating it
    if (updatedData.customer) {
      const customerExists = await User.findById(updatedData.customer);
      if (!customerExists || customerExists.role !== "customer") {
        return res.status(400).json({ error: "Invalid customer ID or user is not a customer" });
      }
    }

    // ✅ Ensure all product designations exist if updating
    if (updatedData.product_designation) {
      if (!Array.isArray(updatedData.product_designation)) {
        return res.status(400).json({ error: "Product designation must be an array of IDs" });
      }

      const validProducts = await ProductDesignation.find({ _id: { $in: updatedData.product_designation } });
      if (validProducts.length !== updatedData.product_designation.length) {
        return res.status(400).json({ error: "Some product designations are invalid" });
      }
    }

    // ✅ Calculate days until PPAP submission if updated
    if (updatedData.ppap_submission_date) {
      const today = new Date();
      const ppapDate = new Date(updatedData.ppap_submission_date);
      updatedData.days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24))); // Convert to days
    }

    const updatedMassProduction = await MassProduction.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true } // ✅ Ensures validation on update
    );

    if (!updatedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" });
    }

    res.json(updatedMassProduction);
  } catch (error) {
    console.error("❌ Error updating MassProduction:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a MassProduction entry
exports.deleteMassProduction = async (req, res) => {
  try {
    const deletedMassProduction = await MassProduction.findByIdAndDelete(req.params.id);

    if (!deletedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" });
    }

    res.json({ message: "MassProduction deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting MassProduction:", error);
    res.status(500).json({ error: "Server error" });
  }
};
