const Readiness = require("../../models/readiness/readinessModel")
const mongoose = require("mongoose")

exports.createReadiness = async (req, res) => {
  try {
    // Create a new readiness entry with the provided data
    const readinessData = req.body

    // Generate a unique ID for the readiness entry if not provided
    if (!readinessData.id) {
      readinessData.id = `RDN-${Date.now()}-${Math.floor(Math.random() * 100)}`
    }

    // Create the readiness entry
    const newReadiness = new Readiness(readinessData)
    await newReadiness.save()

    res.status(201).json({
      message: "Readiness created successfully",
      data: newReadiness,
    })
  } catch (error) {
    console.error("Error creating Readiness:", error.message)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.getAllReadiness = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      project_number,
      part_number,
      part_designation,
      search,
      sortBy = "createdAt",
      sortOrder = -1,
    } = req.query

    // Build filter object
    const filter = {}

    // Apply specific filters if provided
    if (status) filter.status = status
    if (project_number) filter.project_number = { $regex: project_number, $options: "i" }
    if (part_number) filter.part_number = { $regex: part_number, $options: "i" }
    if (part_designation) filter.part_designation = { $regex: part_designation, $options: "i" }

    // Handle search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, "i")

      // First check if search is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search)) {
        filter.$or = [
          { _id: search },
          { id: searchRegex },
          { project_number: searchRegex },
          { part_number: searchRegex },
          { part_designation: searchRegex },
          { description: searchRegex },
        ]
      } else {
        filter.$or = [
          { id: searchRegex },
          { project_number: searchRegex },
          { part_number: searchRegex },
          { part_designation: searchRegex },
          { description: searchRegex },
        ]
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
    const [readinessEntries, total] = await Promise.all([
      Readiness.find(filter)
        .populate("Documentation")
        .populate("Logistics")
        .populate("Maintenance")
        .populate("Packaging")
        .populate("ProcessStatusIndustrials")
        .populate("ProductProcess")
        .populate("RunAtRateProduction")
        .populate("Safety")
        .populate("Suppliers") // Use the field name that exists in your schema
        .populate("ToolingStatus")
        .populate("Training")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Readiness.countDocuments(filter),
    ])

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum)

    res.status(200).json({
      data: readinessEntries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching Readiness entries:", error)
    res.status(500).json({ message: "Error fetching Readiness entries", error: error.message })
  }
}

exports.getReadinessById = async (req, res) => {
  try {
    const readiness = await Readiness.findById(req.params.id)
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

    if (!readiness) {
      return res.status(404).json({ message: "Readiness entry not found" })
    }

    res.status(200).json(readiness)
  } catch (error) {
    res.status(500).json({ message: "Error fetching Readiness entry", error: error.message })
  }
}

exports.updateReadiness = async (req, res) => {
  try {
    const updatedReadiness = await Readiness.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

    if (!updatedReadiness) {
      return res.status(404).json({ message: "Readiness entry not found" })
    }

    res.status(200).json({
      message: "Readiness updated successfully",
      data: updatedReadiness,
    })
  } catch (error) {
    res.status(500).json({ message: "Error updating Readiness entry", error: error.message })
  }
}

exports.deleteReadiness = async (req, res) => {
  try {
    const deletedReadiness = await Readiness.findByIdAndDelete(req.params.id)

    if (!deletedReadiness) {
      return res.status(404).json({ message: "Readiness entry not found" })
    }

    res.status(200).json({ message: "Readiness deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting Readiness entry", error: error.message })
  }
}

// Get filter options for dropdown menus
exports.getFilterOptions = async (req, res) => {
  try {
    const { field } = req.params

    // Only allow specific fields to be queried
    const allowedFields = ["status", "project_number", "part_number", "part_designation"]

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field for filter options" })
    }

    // Get distinct values for the requested field
    const options = await Readiness.distinct(field)

    res.status(200).json(options)
  } catch (error) {
    console.error("Error fetching filter options:", error)
    res.status(500).json({ message: "Error fetching filter options", error: error.message })
  }
}
