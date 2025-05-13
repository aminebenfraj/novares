const MassProduction = require("../models/MassProductionModel")
const ProductDesignation = require("../models/ProductDesignationModel")
const User = require("../models/UserModel")
const sendEmail = require("../utils/emailService") // ✅ Import Nodemailer service
const mongoose = require("mongoose")
exports.createMassProduction = async (req, res) => {
  try {
    console.log("🔍 Received Data:", req.body) // ✅ Debugging log

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
      feasibility,
      validation_for_offer,
      customer_offer,
      customer_order,
      ok_for_lunch,
      kick_off,
      design,
      facilities,
      p_p_tuning,
      process_qualif,
      qualification_confirmation,
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
      checkinRoles, // Add this to capture which roles are checked in the form
    } = req.body

    // ✅ Ensure customer exists and has "Customer" role
    const customerExists = await User.findById(customer)
    if (!customerExists || !customerExists.roles.includes("Customer")) {
      return res.status(400).json({ error: "Invalid customer ID or user is not a customer" })
    }

    // ✅ Validate `product_designation` as MongoDB ObjectIds
    if (!Array.isArray(product_designation)) {
      return res.status(400).json({ error: "Product designation must be an array of IDs" })
    }

    console.log("🔍 Raw product_designation received:", product_designation)

    if (product_designation.length === 0) {
      return res.status(400).json({ error: "No valid product designation IDs provided" })
    }

    const validProducts = await ProductDesignation.find({ _id: { $in: product_designation } })
    if (validProducts.length !== product_designation.length) {
      return res.status(400).json({
        error: "Some product designations are invalid or do not exist in the database",
        missingIds: product_designation.filter(
          (id) => !validProducts.some((product) => product._id.toString() === id.toString()),
        ),
      })
    }

    // ✅ Calculate days until PPAP submission
    let days_until_ppap_submission = null
    if (ppap_submission_date) {
      const today = new Date()
      const ppapDate = new Date(ppap_submission_date)
      if (!isNaN(ppapDate)) {
        days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)))
      }
    }

    // Add this after the days_until_ppap_submission calculation
    // ✅ Automatically set closure date when status is closed or cancelled
    if (status === "closed" || status === "cancelled") {
      if (!closure) {
        const closure = new Date().toISOString()
      }
    }

    console.log("✅ Valid Products in DB:", validProducts)

    // ✅ Create new MassProduction entry (without assignedRole and assignedEmail)
    const newMassProduction = new MassProduction({
      id,
      status,
      status_type,
      project_n,
      product_designation: validProducts.map((product) => product._id),
      description,
      customer,
      technical_skill,
      initial_request,
      request_original,
      feasibility,
      validation_for_offer,
      customer_offer,
      customer_order,
      ok_for_lunch,
      kick_off,
      design,
      facilities,
      p_p_tuning,
      process_qualif,
      qualification_confirmation,
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
    })

    await newMassProduction.save()
    console.log("✅ Mass Production Saved:", newMassProduction)

    // Get the roles that are checked in the form
    const checkedRoles = []
    if (checkinRoles) {
      // Extract role names from the checkinRoles object
      Object.keys(checkinRoles).forEach((roleKey) => {
        // Add all roles regardless of their value - we want to notify all role holders
        // Convert the role key to match the format in UserModel
        const formattedRole = roleKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        checkedRoles.push(formattedRole)
      })
    }

    console.log("✅ Roles to notify:", checkedRoles)

    // Find all users with the checked roles
    const usersToNotify = await User.find({
      roles: { $in: checkedRoles },
    })

    console.log(`✅ Found ${usersToNotify.length} users to notify with roles:`, checkedRoles)
    console.log(
      "✅ Users to notify:",
      usersToNotify.map((user) => ({ username: user.username, email: user.email, roles: user.roles })),
    )

    // Send email to each user
    const emailSubject = `Mass Production Task: ${project_n}`

    for (const user of usersToNotify) {
      const emailBody = `
    <h3>Dear ${user.username},</h3>
    <p>A new mass production task has been created that requires your attention.</p>
    <p><strong>Project:</strong> ${project_n}</p>
    <p><strong>Description:</strong> ${description || "No description provided"}</p>
    <p>Please log in and review the mass production details.</p>
    <a href="http://localhost:5173/masspd/detail/${newMassProduction._id}">View Task</a>
  `

      try {
        await sendEmail(user.email, emailSubject, emailBody)
        console.log(`📧 Email sent successfully to ${user.email} (${user.roles.join(", ")})`)
      } catch (emailError) {
        console.error(`❌ Error sending email to ${user.email}:`, emailError.message)
      }
    }

    res.status(201).json({
      message: `Mass Production task created & emails sent to ${usersToNotify.length} users!`,
      newMassProduction,
    })
  } catch (error) {
    console.error("❌ Error creating MassProduction:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// ✅ Get all MassProduction entries (with filtering, pagination)
exports.getAllMassProductions = async (req, res) => {
  try {
    const { status, customer, page = 1, limit = 10 } = req.query

    const filter = {}
    if (status) filter.status = status
    if (customer) filter.customer = customer

    const massProductions = await MassProduction.find(filter)
      .populate("customer", "username email")
      .populate("product_designation", "part_name reference")
      .populate("feasibility")
      .populate("validation_for_offer", null, "validationForOffer") // ✅ FIX: Specify model name
      .populate("ok_for_lunch")
      .populate("kick_off")
      .populate("design")
      .populate("facilities")
      .populate("p_p_tuning")
      .populate("process_qualif")
      .populate("qualification_confirmation") // Add this line
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))

    res.json(massProductions)
  } catch (error) {
    console.error("❌ Error fetching MassProductions:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// ✅ Get a single MassProduction by ID
exports.getMassProductionById = async (req, res) => {
  try {
    const massProduction = await MassProduction.findById(req.params.id)
      .populate("customer", "username email")
      .populate("product_designation", "part_name reference")
      .populate("feasibility")
      .populate("validation_for_offer", null, "validationForOffer") // ✅ FIX: Specify model name
      .populate("ok_for_lunch")
      .populate("kick_off")
      .populate("design")
      .populate("facilities")
      .populate("p_p_tuning")
      .populate("process_qualif")
      .populate("qualification_confirmation") // Add this line

    if (!massProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    res.json(massProduction)
  } catch (error) {
    console.error("❌ Error fetching MassProduction by ID:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// ✅ Update a MassProduction entry
exports.updateMassProduction = async (req, res) => {
  try {
    const updatedData = req.body

    // ✅ Ensure customer exists if updating it
    if (updatedData.customer) {
      const customerExists = await User.findById(updatedData.customer)
      if (!customerExists || !customerExists.roles.includes("Customer")) {
        return res.status(400).json({ error: "Invalid customer ID or user is not a customer" })
      }
    }

    // ✅ Ensure all product designations exist if updating
    if (updatedData.product_designation) {
      if (!Array.isArray(updatedData.product_designation)) {
        return res.status(400).json({ error: "Product designation must be an array of IDs" })
      }

      const validProducts = await ProductDesignation.find({ _id: { $in: updatedData.product_designation } })
      if (validProducts.length !== updatedData.product_designation.length) {
        return res.status(400).json({ error: "Some product designations are invalid" })
      }
    }

    // ✅ Calculate days until PPAP submission if updated
    if (updatedData.ppap_submission_date) {
      const today = new Date()
      const ppapDate = new Date(updatedData.ppap_submission_date)
      updatedData.days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24))) // Convert to days
    }

    // ✅ Automatically set closure date when status is closed or cancelled
    if (updatedData.status === "closed" || updatedData.status === "cancelled") {
      updatedData.closure = new Date().toISOString()
    }

    const updatedMassProduction = await MassProduction.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }, // ✅ Ensures validation on update
    )

    if (!updatedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    res.json(updatedMassProduction)
  } catch (error) {
    console.error("❌ Error updating MassProduction:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// ✅ Delete a MassProduction entry
exports.deleteMassProduction = async (req, res) => {
  try {
    const deletedMassProduction = await MassProduction.findByIdAndDelete(req.params.id)

    if (!deletedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    res.json({ message: "MassProduction deleted successfully" })
  } catch (error) {
    console.error("❌ Error deleting MassProduction:", error)
    res.status(500).json({ error: "Server error" })
  }
}
