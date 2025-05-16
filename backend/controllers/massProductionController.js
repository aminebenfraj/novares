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
      // Create a data object for the table
      const emailData = {
        project_number: project_n,
        description: description || "No description provided",
        status: status,
        customer: customerExists.username,
        initial_request: formatDate(initial_request),
        technical_skill: technical_skill || "N/A",
        ppap_submission_date: ppap_submission_date ? formatDate(ppap_submission_date) : "Not set",
        days_until_ppap: days_until_ppap_submission !== null ? `${days_until_ppap_submission} days` : "N/A",
      }

      // Create the email body
      const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Mass Production Notification</h2>
      
      <h3>Dear ${user.username},</h3>
      
      <p>A new mass production task has been created that requires your attention.</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
        <p><strong>Project:</strong> ${project_n}</p>
        <p><strong>Role:</strong> ${user.roles.join(", ")}</p>
      </div>
      
      <p>Please review the details below:</p>
    </div>
  `

      try {
        await sendEmail(user.email, emailSubject, emailBody, emailData)
        console.log(`📧 Email sent successfully to ${user.email} (${user.roles.join(", ")})`)
      } catch (emailError) {
        console.error(`❌ Error sending email to ${user.email}:`, emailError.message)
      }
    }

    // Helper function to format dates
    function formatDate(dateString) {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
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

    // Send notification email if status has changed
    if (updatedData.status && updatedMassProduction.status !== req.body.status) {
      try {
        // Find users with Admin role to notify about status change
        const adminsToNotify = await User.find({ roles: "Admin" })

        if (adminsToNotify.length > 0) {
          // Get customer information
          const customerInfo = await User.findById(updatedMassProduction.customer)

          // Get product designations
          const productDesignations = await ProductDesignation.find({
            _id: { $in: updatedMassProduction.product_designation },
          })

          const productNames = productDesignations.map((p) => p.part_name).join(", ")

          // Format dates for display
          const formatDate = (date) => {
            if (!date) return "N/A"
            return new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          // Calculate completion percentage based on completed stages
          const calculateCompletionPercentage = () => {
            const stages = [
              updatedMassProduction.feasibility,
              updatedMassProduction.validation_for_offer,
              updatedMassProduction.ok_for_lunch,
              updatedMassProduction.kick_off,
              updatedMassProduction.design,
              updatedMassProduction.facilities,
              updatedMassProduction.p_p_tuning,
              updatedMassProduction.process_qualif,
              updatedMassProduction.qualification_confirmation,
            ]

            const completedStages = stages.filter((stage) => stage).length
            return Math.round((completedStages / stages.length) * 100)
          }

          const statusChangeData = {
            project_number: updatedMassProduction.project_n,
            id: updatedMassProduction.id,
            previous_status: req.body.status,
            new_status: updatedMassProduction.status,
            customer: customerInfo ? customerInfo.username : "N/A",
            product_designations: productNames || "N/A",
            technical_skill: updatedMassProduction.technical_skill || "N/A",
            initial_request: formatDate(updatedMassProduction.initial_request),
            ppap_submission_date: formatDate(updatedMassProduction.ppap_submission_date),
            days_until_ppap:
              updatedMassProduction.days_until_ppap_submission !== null
                ? `${updatedMassProduction.days_until_ppap_submission} days`
                : "N/A",
            customer_offer: updatedMassProduction.customer_offer || "N/A",
            customer_order: updatedMassProduction.customer_order || "N/A",
            completion_percentage: `${calculateCompletionPercentage()}%`,
            updated_at: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            updated_by: "System", // Ideally this would be the current user
          }

          const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Mass Production Status Change</h2>
          
          <h3>Dear Admin,</h3>
          
          <p>A mass production record has been updated with a new status.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p><strong>Project:</strong> ${updatedMassProduction.project_n}</p>
            <p><strong>ID:</strong> ${updatedMassProduction.id}</p>
            <p><strong>Status Change:</strong> <span style="color: #6b7280;">${req.body.status}</span> → <span style="color: #10b981; font-weight: bold;">${updatedMassProduction.status}</span></p>
          </div>
          
          <p>Below is the detailed information about this mass production record:</p>
          
          <a href="http://localhost:5173/masspd/detail/${updatedMassProduction._id}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin: 10px 0;">View Complete Details</a>
        </div>
      `

          for (const admin of adminsToNotify) {
            await sendEmail(
              admin.email,
              `Status Update: ${updatedMassProduction.project_n}`,
              emailBody,
              statusChangeData,
            )
          }
        }
      } catch (emailError) {
        console.error("❌ Error sending status update email:", emailError)
        // Don't throw error, just log it - we don't want to fail the update if email fails
      }
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
