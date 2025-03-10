const MassProduction = require("../models/MassProductionModel");
const ProductDesignation = require("../models/ProductDesignationModel");
const User = require("../models/UserModel");
const sendEmail = require("../utils/emailService"); // ✅ Import Nodemailer service
const mongoose = require("mongoose");
exports.createMassProduction = async (req, res) => {
  try {
    console.log("🔍 Received Data:", req.body); // ✅ Debugging log

    let {
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
      feasability,
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
      assignedRole,
      assignedEmail
    } = req.body;

    // ✅ Ensure customer exists and has "Customer" role
    const customerExists = await User.findById(customer);
    if (!customerExists || !customerExists.roles.includes("Customer")) {
      return res.status(400).json({ error: "Invalid customer ID or user is not a customer" });
    }

    // ✅ Ensure assignedRole and assignedEmail are provided
    if (!assignedRole || !assignedEmail) {
      console.error("❌ Missing assignedRole or assignedEmail:", { assignedRole, assignedEmail });
      return res.status(400).json({ error: "Assigned role and email are required" });
    }

    // ✅ Validate `product_designation` as MongoDB ObjectIds
    if (!Array.isArray(product_designation)) {
      return res.status(400).json({ error: "Product designation must be an array of IDs" });
    }

    console.log("🔍 Raw product_designation received:", product_designation);


    if (product_designation.length === 0) {
      return res.status(400).json({ error: "No valid product designation IDs provided" });
    }

    const validProducts = await ProductDesignation.find({ id: { $in: product_designation } });

    if (validProducts.length !== product_designation.length) {
      return res.status(400).json({
        error: "Some product designations are invalid or do not exist in the database",
        missingIds: product_designation.filter(
          id => !validProducts.some(product => product._id.toString() === id.toString())
        )
      });
    }

    // ✅ Calculate days until PPAP submission
    let days_until_ppap_submission = null;
    if (ppap_submission_date) {
      const today = new Date();
      const ppapDate = new Date(ppap_submission_date);
      if (!isNaN(ppapDate)) {
        days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)));
      }
    }

    console.log("✅ Valid Products in DB:", validProducts);

    // ✅ Create new MassProduction entry
    const newMassProduction = new MassProduction({
      id,
      status,
      status_type,
      project_n,
      product_designation: validProducts.map(product => product._id), // ✅ Store only valid ObjectIds
      description,
      customer,
      technical_skill,
      initial_request,
      request_original,
      feasability,
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
      days_until_ppap_submission,
      assignedRole,
      assignedEmail
    });

    await newMassProduction.save();
    console.log("✅ Mass Production Saved:", newMassProduction);

    // ✅ Send email notification to assigned user
    const emailSubject = `Mass Production Task Assigned to ${assignedRole}`;
    const emailBody = `
      <h3>Dear ${assignedRole},</h3>
      <p>A new mass production task has been assigned to your role.</p>
      <p><strong>Project:</strong> ${project_n}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p>Please log in and complete the missing fields.</p>
      <a href="http://your-frontend-url.com/mass-production/${newMassProduction._id}">View Task</a>
    `;

    try {
      await sendEmail(assignedEmail, emailSubject, emailBody);
      console.log(`📧 Email sent successfully to ${assignedEmail}`);
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError.message);
    }

    res.status(201).json({ message: "Mass Production task created & email sent!", newMassProduction });
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
      .populate("feasability")
      .populate("validation_for_offer")
      .populate("ok_for_lunch")
      .populate("kick_off")
      .populate("design")
      .populate("facilities")
      .populate("p_p_tuning")
      .populate("process_qualif")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(massProductions);
  } catch (error) {
    console.error("❌ Error fetching MassProductions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get a single MassProduction by ID
exports.getMassProductionById = async (req, res) => {
  try {
    const massProduction = await MassProduction.findById(req.params.id)
    .populate("customer", "username email")
    .populate("product_designation", "part_name reference")
    .populate("feasability")
    .populate("validation_for_offer")
    .populate("ok_for_lunch")
    .populate("kick_off")
    .populate("design")
    .populate("facilities")
    .populate("p_p_tuning")
    .populate("process_qualif")

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

/**
 * Update a mass production record to link it with a specific step
 * @route POST /api/mass-production/:id/steps
 * @param {string} req.params.id - Mass production ID
 * @param {Object} req.body - Step data containing step name and step ID
 * @param {string} req.body.step - Name of the step (e.g., 'checkin', 'feasibility', etc.)
 * @param {string} req.body.stepId - MongoDB ID of the step record
 * @returns {Object} Updated mass production record
 */
exports.updateMassProductionStep = async (req, res) => {
  try {
    const { id } = req.params
    const { step, stepId } = req.body

    // Validate inputs
    if (!step || !stepId) {
      return res.status(400).json({
        success: false,
        message: "Step name and step ID are required",
      })
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      })
    }

    // Create update object with the step reference
    const updateData = {
      [`steps.${step}`]: stepId,
    }

    // Find and update the mass production record
    const updatedMassProduction = await MassProduction.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    )

    // Check if record exists
    if (!updatedMassProduction) {
      return res.status(404).json({
        success: false,
        message: "Mass production record not found",
      })
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: updatedMassProduction,
      message: `Successfully linked ${step} to mass production`,
    })
  } catch (error) {
    console.error(`Error updating mass production step:`, error)
    return res.status(500).json({
      success: false,
      message: "Server error while updating mass production step",
      error: error.message,
    })
  }
}

