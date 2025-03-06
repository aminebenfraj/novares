const MachineMaterial = require("../../models/gestionStockModels/MachineMaterialModel")
const Material = require("../../models/gestionStockModels/MaterialModel")

exports.allocateStock = async (req, res) => {
  try {
    const { materialId, allocations, userId } = req.body

    // Validate material existence
    const material = await Material.findById(materialId)
    if (!material) {
      return res.status(404).json({ error: "Material not found" })
    }

    // Check if enough stock is available
    const totalRequestedStock = allocations.reduce((sum, alloc) => sum + alloc.allocatedStock, 0)

    if (totalRequestedStock > material.currentStock) {
      return res.status(400).json({ error: "Total allocated stock exceeds available stock." })
    }

    let totalUsedStock = 0 // Track how much stock has been allocated

    for (const { machineId, allocatedStock } of allocations) {
      if (allocatedStock <= 0) {
        return res.status(400).json({ error: "Allocated stock must be greater than 0." })
      }

      // Check if there's enough stock remaining to allocate
      if (totalUsedStock + allocatedStock > material.currentStock) {
        return res.status(400).json({
          error: `Not enough stock available. Only ${material.currentStock - totalUsedStock} left.`,
        })
      }

      let machineMaterial = await MachineMaterial.findOne({ material: materialId, machine: machineId })

      if (machineMaterial) {
        // Log previous stock before updating
        machineMaterial.history.push({
          changedBy: userId,
          previousStock: machineMaterial.allocatedStock,
          newStock: allocatedStock,
          date: new Date(),
          comment: `Stock updated manually.`,
        })

        machineMaterial.allocatedStock = allocatedStock
        await machineMaterial.save()
      } else {
        // Create new allocation with initial history
        machineMaterial = new MachineMaterial({
          material: materialId,
          machine: machineId,
          allocatedStock,
          history: [
            {
              changedBy: userId,
              previousStock: 0,
              newStock: allocatedStock,
              date: new Date(),
              comment: `Initial allocation.`,
            },
          ],
        })
        await machineMaterial.save()
      }

      totalUsedStock += allocatedStock // Update used stock
    }

    return res.status(200).json({ message: "Stock successfully allocated with validation." })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Get all stock allocations
exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await MachineMaterial.find().populate("machine material")
    return res.status(200).json(allocations)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Get stock allocation for a specific material
exports.getMaterialAllocations = async (req, res) => {
  try {
    const { materialId } = req.params
    const allocations = await MachineMaterial.find({ material: materialId }).populate("machine")
    return res.status(200).json(allocations)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Get stock allocation history for a machine
exports.getMachineStockHistory = async (req, res) => {
  try {
    const { machineId } = req.params
    const history = await MachineMaterial.find({ machine: machineId }).populate("material").select("history material")
    return res.status(200).json(history)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Update a specific allocation
exports.updateAllocation = async (req, res) => {
  try {
    const { id } = req.params
    const { allocatedStock, userId, comment } = req.body

    // Find the allocation
    const allocation = await MachineMaterial.findById(id)
    if (!allocation) {
      return res.status(404).json({ error: "Allocation not found" })
    }

    // Get material to check stock availability
    const material = await Material.findById(allocation.material)
    if (!material) {
      return res.status(404).json({ error: "Material not found" })
    }

    // Calculate stock difference
    const stockDifference = allocatedStock - allocation.allocatedStock

    // Check if enough stock is available if increasing allocation
    if (stockDifference > 0 && stockDifference > material.currentStock) {
      return res.status(400).json({
        error: `Not enough stock available. Only ${material.currentStock} units available.`,
      })
    }

    // Create history entry
    const historyEntry = {
      previousStock: allocation.allocatedStock,
      newStock: allocatedStock,
      date: new Date(),
      comment: comment || `Stock updated from ${allocation.allocatedStock} to ${allocatedStock}.`,
    }

    // Only add changedBy if userId is provided
    if (userId) {
      // If your schema expects an ObjectId, you might need to convert the string
      // Uncomment this if needed:
      // const mongoose = require('mongoose');
      // historyEntry.changedBy = mongoose.Types.ObjectId(userId);

      // Or if your schema accepts string IDs:
      historyEntry.changedBy = userId
    }

    // Add to history
    allocation.history.push(historyEntry)

    // Update allocation
    allocation.allocatedStock = allocatedStock
    await allocation.save()

    return res.status(200).json({
      message: "Allocation updated successfully",
      allocation,
    })
  } catch (error) {
    console.error("Update allocation error:", error)
    return res.status(500).json({ error: error.message })
  }
}

