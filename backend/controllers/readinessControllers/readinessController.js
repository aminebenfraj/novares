const mongoose = require("mongoose")
const Readiness = require("../../models/readiness/readinessModel")
const sendEmail = require("../../utils/emailService") // Assuming you have this utility

// Helper function to generate a unique ID
const generateUniqueId = () => {
  return `RDN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// Create a new Readiness entry
exports.createReadiness = async (req, res) => {
  try {
    console.log("🔍 Received Data:", req.body) // Debugging log

    const {
      status,
      project_name,
      description,
      assignedRole,
      assignedEmail,
      // Add other fields as needed
    } = req.body

    // Ensure required fields are provided
    if (!status) {
      return res.status(400).json({ error: "Status is required" })
    }

    if (!project_name) {
      return res.status(400).json({ error: "Project name is required" })
    }

    if (!assignedRole || !assignedEmail) {
      console.error("❌ Missing assignedRole or assignedEmail:", { assignedRole, assignedEmail })
      return res.status(400).json({ error: "Assigned role and email are required" })
    }

    // Generate a unique ID
    const id = generateUniqueId()

    // Create new Readiness entry
    const newReadiness = new Readiness({
      id,
      status,
      project_name,
      description,
      assignedRole,
      assignedEmail,
      // Initialize domain references as null
      Documentation: null,
      Logistics: null,
      Maintenance: null,
      Packaging: null,
      ProcessStatusIndustrials: null,
      ProductProcess: null,
      RunAtRateProduction: null,
      Safety: null,
      Suppliers: null,
      ToolingStatus: null,
      Training: null,
    })

    await newReadiness.save()
    console.log("✅ Readiness Entry Saved:", newReadiness)

    // Send email notification to assigned user
    const emailSubject = `Readiness Task Assigned to ${assignedRole}`
    const emailBody = `
      <h3>Dear ${assignedRole},</h3>
      <p>A new readiness task has been assigned to your role.</p>
      <p><strong>Project:</strong> ${project_name || "New Project"}</p>
      <p><strong>Description:</strong> ${description || "No description provided"}</p>
      <p>Please log in and complete the missing fields.</p>
      <a href="http://your-frontend-url.com/readiness/${newReadiness.id}">View Task</a>
    `

    try {
      await sendEmail(assignedEmail, emailSubject, emailBody)
      console.log(`📧 Email sent successfully to ${assignedEmail}`)
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError.message)
    }

    res.status(201).json({
      message: "Readiness task created successfully",
      data: newReadiness,
    })
  } catch (error) {
    console.error("❌ Error creating Readiness:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

// Get all Readiness entries (with filtering, pagination)
exports.getAllReadiness = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, assignedEmail, project_name } = req.query

    const filter = {}
    if (status) filter.status = status
    if (assignedEmail) filter.assignedEmail = assignedEmail
    if (project_name) filter.project_name = { $regex: project_name, $options: "i" }

    const readinessEntries = await Readiness.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("Documentation")
      .populate("Logistics")
      .populate("Maintenance")
      .populate("Packaging")
      .populate("ProcessStatusIndustrials")
      .populate("ProductProcess")
      .populate("RunAtRateProduction")
      .populate("Safety")
      .populate("Suppliers")
      .populate("ToolingStatus")
      .populate("Training")

    // Count total documents for pagination
    const totalCount = await Readiness.countDocuments(filter)

    res.json({
      data: readinessEntries,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalCount / Number(limit)),
      },
    })
  } catch (error) {
    console.error("❌ Error fetching Readiness entries:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Get a single Readiness by ID
exports.getReadinessById = async (req, res) => {
  try {
    // First try to find by custom id field
    let readiness = await Readiness.findOne({ id: req.params.id })
      .populate("Documentation")
      .populate("Logistics")
      .populate("Maintenance")
      .populate("Packaging")
      .populate("ProcessStatusIndustrials")
      .populate("ProductProcess")
      .populate("RunAtRateProduction")
      .populate("Safety")
      .populate("Suppliers")
      .populate("ToolingStatus")
      .populate("Training")

    // If not found, try by MongoDB _id
    if (!readiness && mongoose.Types.ObjectId.isValid(req.params.id)) {
      readiness = await Readiness.findById(req.params.id)
        .populate("Documentation")
        .populate("Logistics")
        .populate("Maintenance")
        .populate("Packaging")
        .populate("ProcessStatusIndustrials")
        .populate("ProductProcess")
        .populate("RunAtRateProduction")
        .populate("Safety")
        .populate("Suppliers")
        .populate("ToolingStatus")
        .populate("Training")
    }

    if (!readiness) {
      return res.status(404).json({ error: "Readiness entry not found" })
    }

    res.json(readiness)
  } catch (error) {
    console.error("❌ Error fetching Readiness by ID:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Update a Readiness entry
exports.updateReadiness = async (req, res) => {
  try {
    const updatedData = req.body

    // First try to find by custom id field
    let readiness
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // If it's a valid MongoDB ObjectId, search by _id
      readiness = await Readiness.findById(req.params.id)
    } else {
      // Otherwise search by custom id field
      readiness = await Readiness.findOne({ id: req.params.id })
    }

    if (!readiness) {
      return res.status(404).json({ error: "Readiness entry not found" })
    }

    // Update the readiness entry
    Object.keys(updatedData).forEach((key) => {
      readiness[key] = updatedData[key]
    })

    const updatedReadiness = await readiness.save()

    // If assignedEmail or assignedRole changed, send notification
    if (
      (updatedData.assignedEmail && updatedData.assignedEmail !== readiness.assignedEmail) ||
      (updatedData.assignedRole && updatedData.assignedRole !== readiness.assignedRole)
    ) {
      const emailSubject = `Readiness Task Reassigned to ${updatedReadiness.assignedRole}`
      const emailBody = `
        <h3>Dear ${updatedReadiness.assignedRole},</h3>
        <p>A readiness task has been reassigned to your role.</p>
        <p><strong>Project:</strong> ${updatedReadiness.project_name || "Project"}</p>
        <p><strong>Description:</strong> ${updatedReadiness.description || "No description provided"}</p>
        <p>Please log in and review the task.</p>
        <a href="http://your-frontend-url.com/readiness/${updatedReadiness.id}">View Task</a>
      `

      try {
        await sendEmail(updatedReadiness.assignedEmail, emailSubject, emailBody)
        console.log(`📧 Reassignment email sent successfully to ${updatedReadiness.assignedEmail}`)
      } catch (emailError) {
        console.error("❌ Error sending reassignment email:", emailError.message)
      }
    }

    res.json({
      message: "Readiness entry updated successfully",
      data: updatedReadiness,
    })
  } catch (error) {
    console.error("❌ Error updating Readiness:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Delete a Readiness entry
exports.deleteReadiness = async (req, res) => {
  try {
    // First try to find by custom id field
    let readiness
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // If it's a valid MongoDB ObjectId, delete by _id
      readiness = await Readiness.findByIdAndDelete(req.params.id)
    } else {
      // Otherwise find by custom id field and delete
      readiness = await Readiness.findOne({ id: req.params.id })
      if (readiness) {
        await Readiness.deleteOne({ _id: readiness._id })
      }
    }

    if (!readiness) {
      return res.status(404).json({ error: "Readiness entry not found" })
    }

    res.json({ message: "Readiness entry deleted successfully" })
  } catch (error) {
    console.error("❌ Error deleting Readiness:", error)
    res.status(500).json({ error: "Server error" })
  }
}

