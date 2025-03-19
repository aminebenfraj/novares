const Readiness = require("../../models/readiness/ReadinessModel")

exports.createReadiness = async (req, res) => {
  try {
    console.log("📢 Received Readiness Data:", JSON.stringify(req.body, null, 2))

    // Create a new readiness entry with the provided data
    const readinessData = req.body

    // Ensure all related entity IDs are properly formatted as ObjectIds
    const relatedEntities = [
      "Documentation",
      "Logistics",
      "Maintenance",
      "Packaging",
      "ProcessStatusIndustrials",
      "ProductProcess",
      "RunAtRateProduction",
      "Safety",
      "Supp", // Updated from Suppliers to Supp
      "ToolingStatus",
      "Training",
    ]

    // Generate a unique ID for the readiness entry if not provided
    if (!readinessData.id) {
      readinessData.id = `RDN-${Date.now()}-${Math.floor(Math.random() * 100)}`
    }

    // Create the readiness entry
    const newReadiness = new Readiness(readinessData)
    await newReadiness.save()

    console.log("✅ Readiness created successfully:", newReadiness)

    res.status(201).json({
      message: "Readiness created successfully",
      data: newReadiness,
    })
  } catch (error) {
    console.error("❌ Error creating Readiness:", error.message)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.getAllReadiness = async (req, res) => {
  try {
    const readiness = await Readiness.find()
      .populate("Documentation")
      .populate("Logistics")
      .populate("Maintenance")
      .populate("Packaging")
      .populate("ProcessStatusIndustrials")
      .populate("ProductProcess")
      .populate("RunAtRateProduction")
      .populate("Safety")
      .populate("Supp") // Updated from Suppliers to Supp
      .populate("ToolingStatus")
      .populate("Training")

    res.status(200).json(readiness)
  } catch (error) {
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
      .populate("Supp") // Updated from Suppliers to Supp
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
      .populate("Supp") // Updated from Suppliers to Supp
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

