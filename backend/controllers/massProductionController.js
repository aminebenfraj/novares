const MassProduction = require("../models/MassProductionModel")
const ProductDesignation = require("../models/ProductDesignationModel")
const User = require("../models/UserModel")
const sendEmail = require("../utils/emailService")
const mongoose = require("mongoose")

// Create Mass Production
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
      checkinRoles,
    } = req.body

    // Validate customer
    const customerExists = await User.findById(customer)
    if (!customerExists || !customerExists.roles.includes("Customer")) {
      return res.status(400).json({ error: "Invalid customer ID or user is not a customer" })
    }

    // Validate product_designation
    if (!Array.isArray(product_designation) || product_designation.length === 0) {
      return res.status(400).json({ error: "Product designation must be a non-empty array of IDs" })
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

    // Calculate days until PPAP submission
    let days_until_ppap_submission = null
    if (ppap_submission_date) {
      const today = new Date()
      const ppapDate = new Date(ppap_submission_date)
      if (!isNaN(ppapDate)) {
        days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)))
      }
    }

    // Set closure date for closed or cancelled status
    let closureDate = closure
    if ((status === "closed" || status === "cancelled") && !closure) {
      closureDate = new Date()
    }

    // Create new MassProduction entry
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
      closure: closureDate,
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

    // Get the roles that are checked in the form
    const checkedRoles = []
    if (checkinRoles) {
      Object.keys(checkinRoles).forEach((roleKey) => {
        const formattedRole = roleKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        checkedRoles.push(formattedRole)
      })
    }

    // Find all users with the checked roles
    const usersToNotify = await User.find({
      roles: { $in: Object.keys(checkinRoles) },
    })

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
      } catch (emailError) {
        console.error(`Error sending email to ${user.email}:`, emailError.message)
      }
    }

    res.status(201).json({
      message: `Mass Production task created & emails sent to ${usersToNotify.length} users!`,
      newMassProduction,
    })
  } catch (error) {
    console.error("Error creating MassProduction:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Get all MassProduction entries with advanced filtering and pagination
exports.getAllMassProductions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      project_n,
      product_designation,
      customer,
      id,
      description,
      search,
      sortBy = "createdAt",
      sortOrder = -1,
      dateFrom,
      dateTo,
      technical_skill,
    } = req.query

    // Build filter object
    const filter = {}

    // Apply specific filters if provided
    if (status) filter.status = status
    if (project_n) filter.project_n = { $regex: project_n, $options: "i" }
    if (id) filter.id = { $regex: id, $options: "i" }
    if (description) filter.description = { $regex: description, $options: "i" }
    if (technical_skill) filter.technical_skill = technical_skill

    // Handle customer filter (by ID or username)
    if (customer) {
      if (mongoose.Types.ObjectId.isValid(customer)) {
        filter.customer = customer
      } else {
        // If not a valid ObjectId, try to find by username
        const customerByName = await User.findOne({
          username: { $regex: new RegExp(customer, "i") },
          roles: "Customer",
        })

        if (customerByName) {
          filter.customer = customerByName._id
        }
      }
    }

    // Handle product_designation filter
    if (product_designation) {
      if (mongoose.Types.ObjectId.isValid(product_designation)) {
        filter.product_designation = product_designation
      } else {
        // If not a valid ObjectId, try to find by part_name or reference
        const productByName = await ProductDesignation.findOne({
          $or: [
            { part_name: { $regex: new RegExp(product_designation, "i") } },
            { reference: { $regex: new RegExp(product_designation, "i") } },
          ],
        })

        if (productByName) {
          filter.product_designation = productByName._id
        }
      }
    }

    // Handle date range filter
    if (dateFrom || dateTo) {
      filter.initial_request = {}
      if (dateFrom) filter.initial_request.$gte = new Date(dateFrom)
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999) // Include the entire end day
        filter.initial_request.$lte = endDate
      }
    }

    // Handle search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, "i")

      // First check if search is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search)) {
        // Search in reference fields
        const customerIds = await User.find({
          $or: [{ _id: search }, { username: searchRegex }],
          roles: "Customer",
        }).distinct("_id")

        const productIds = await ProductDesignation.find({
          $or: [{ _id: search }, { part_name: searchRegex }, { reference: searchRegex }],
        }).distinct("_id")

        filter.$or = [
          { _id: search },
          { id: searchRegex },
          { project_n: searchRegex },
          { description: searchRegex },
          { customer: { $in: customerIds } },
          { product_designation: { $in: productIds } },
        ]
      } else {
        // Regular text search
        filter.$or = [{ id: searchRegex }, { project_n: searchRegex }, { description: searchRegex }]

        // Also search in referenced collections
        const customerIds = await User.find({
          username: searchRegex,
          roles: "Customer",
        }).distinct("_id")

        const productIds = await ProductDesignation.find({
          $or: [{ part_name: searchRegex }, { reference: searchRegex }],
        }).distinct("_id")

        if (customerIds.length > 0) {
          filter.$or.push({ customer: { $in: customerIds } })
        }

        if (productIds.length > 0) {
          filter.$or.push({ product_designation: { $in: productIds } })
        }
      }
    }

    // Prepare sort options
    const sort = {}
    sort[sortBy] = Number.parseInt(sortOrder)

    // Calculate pagination values
    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Execute query with pagination
    const [massProductions, total] = await Promise.all([
      MassProduction.find(filter)
        .populate("customer", "username email")
        .populate("product_designation", "part_name reference")
        .populate("feasibility")
        .populate("validation_for_offer", null, "validationForOffer")
        .populate("ok_for_lunch")
        .populate("kick_off")
        .populate("design")
        .populate("facilities")
        .populate("p_p_tuning")
        .populate("process_qualif")
        .populate("qualification_confirmation")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      MassProduction.countDocuments(filter),
    ])

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum)

    res.json({
      data: massProductions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching MassProductions:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Get a single MassProduction by ID
exports.getMassProductionById = async (req, res) => {
  try {
    const massProduction = await MassProduction.findById(req.params.id)
      .populate("customer", "username email")
      .populate("product_designation", "part_name reference")
      .populate("feasibility")
      .populate("validation_for_offer", null, "validationForOffer")
      .populate("ok_for_lunch")
      .populate("kick_off")
      .populate("design")
      .populate("facilities")
      .populate("p_p_tuning")
      .populate("process_qualif")
      .populate("qualification_confirmation")

    if (!massProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    res.json(massProduction)
  } catch (error) {
    console.error("Error fetching MassProduction by ID:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Update a MassProduction entry
exports.updateMassProduction = async (req, res) => {
  try {
    const updatedData = req.body

    // Validate customer if updating
    if (updatedData.customer) {
      const customerExists = await User.findById(updatedData.customer)
      if (!customerExists || !customerExists.roles.includes("Customer")) {
        return res.status(400).json({ error: "Invalid customer ID or user is not a customer" })
      }
    }

    // Validate product designations if updating
    if (updatedData.product_designation) {
      if (!Array.isArray(updatedData.product_designation)) {
        return res.status(400).json({ error: "Product designation must be an array of IDs" })
      }

      const validProducts = await ProductDesignation.find({ _id: { $in: updatedData.product_designation } })
      if (validProducts.length !== updatedData.product_designation.length) {
        return res.status(400).json({ error: "Some product designations are invalid" })
      }
    }

    // Calculate days until PPAP submission if updated
    if (updatedData.ppap_submission_date) {
      const today = new Date()
      const ppapDate = new Date(updatedData.ppap_submission_date)
      updatedData.days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)))
    }

    // Set closure date when status is closed or cancelled
    if (updatedData.status === "closed" || updatedData.status === "cancelled") {
      updatedData.closure = new Date()
    }

    // Get the original record to check for status change
    const originalRecord = await MassProduction.findById(req.params.id)
    const statusChanged = originalRecord && updatedData.status && originalRecord.status !== updatedData.status

    const updatedMassProduction = await MassProduction.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true },
    )

    if (!updatedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    // Send notification email if status has changed
    if (statusChanged) {
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
            previous_status: originalRecord.status,
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
                <p><strong>Status Change:</strong> <span style="color: #6b7280;">${originalRecord.status}</span> → <span style="color: #10b981; font-weight: bold;">${updatedMassProduction.status}</span></p>
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
        console.error("Error sending status update email:", emailError)
        // Don't throw error, just log it - we don't want to fail the update if email fails
      }
    }

    res.json(updatedMassProduction)
  } catch (error) {
    console.error("Error updating MassProduction:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Delete a MassProduction entry
exports.deleteMassProduction = async (req, res) => {
  try {
    const deletedMassProduction = await MassProduction.findByIdAndDelete(req.params.id)

    if (!deletedMassProduction) {
      return res.status(404).json({ error: "MassProduction not found" })
    }

    res.json({ message: "MassProduction deleted successfully" })
  } catch (error) {
    console.error("Error deleting MassProduction:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Get filter options for dropdown menus
exports.getFilterOptions = async (req, res) => {
  try {
    const { field } = req.params

    // Only allow specific fields to be queried
    const allowedFields = ["status", "project_n", "product_designation", "customer", "technical_skill"]

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field for filter options" })
    }

    let options = []

    // For non-reference fields, use distinct
    if (field === "status" || field === "project_n" || field === "technical_skill") {
      options = await MassProduction.distinct(field)
    } else {
      // For reference fields, get the actual documents
      const distinctIds = await MassProduction.distinct(field)
      const validIds = distinctIds.filter((id) => id != null)

      if (validIds.length === 0) {
        return res.status(200).json([])
      }

      switch (field) {
        case "customer":
          options = await User.find({
            _id: { $in: validIds },
            roles: "Customer",
          })
            .select("username email")
            .lean()
          break
        case "product_designation":
          options = await ProductDesignation.find({ _id: { $in: validIds } })
            .select("part_name reference")
            .lean()
          break
      }
    }

    res.status(200).json(options)
  } catch (error) {
    console.error("Error fetching filter options:", error)
    res.status(500).json({ message: "Error fetching filter options", details: error.message })
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
