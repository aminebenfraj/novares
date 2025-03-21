const Pedido = require("../../models/pedido/Pedido")
const Material = require("../../models/gestionStockModels/MaterialModel")
const Solicitante = require("../../models/pedido/solicitanteModel")
const Tipo = require("../../models/pedido/tipoModel")
const Supplier = require("../../models/gestionStockModels/SupplierModel")
const TableStatus = require("../../models/pedido/TableStatus")
const mongoose = require("mongoose")

// Create Pedido with existence checks
exports.createPedido = async (req, res) => {
  try {
    const {
      tipo,
      descripcionInterna,
      fabricante,
      referencia,
      descripcionProveedor,
      solicitante,
      cantidad,
      precioUnidad,
      importePedido,
      fechaSolicitud,
      proveedor,
      comentario,
      pedir,
      introducidaSAP,
      aceptado,
      direccion,
      weeks,
      table_status,
      recepcionado,
      qrCode,
      ano,
    } = req.body

    // Check if Tipo exists
    const existingTipo = await Tipo.findById(tipo)
    if (!existingTipo) {
      return res.status(400).json({ error: "Tipo not found" })
    }

    // Check if Material (referencia) exists
    const existingMaterial = await Material.findById(referencia)
    if (!existingMaterial) {
      return res.status(400).json({ error: "Material not found" })
    }

    // Check if Solicitante exists
    const existingSolicitante = await Solicitante.findById(solicitante)
    if (!existingSolicitante) {
      return res.status(400).json({ error: "Solicitante not found" })
    }

    // Check if Supplier (proveedor) exists if provided
    if (proveedor) {
      const existingSupplier = await Supplier.findById(proveedor)
      if (!existingSupplier) {
        return res.status(400).json({ error: "Supplier not found" })
      }
    }

    // Check if TableStatus exists if provided
    if (table_status) {
      const existingTableStatus = await TableStatus.findById(table_status)
      if (!existingTableStatus) {
        return res.status(400).json({ error: "Table status not found" })
      }
    }

    // Set default values
    const newPedidoData = {
      tipo,
      descripcionInterna,
      fabricante,
      referencia,
      descripcionProveedor,
      solicitante,
      cantidad,
      precioUnidad,
      importePedido,
      fechaSolicitud: fechaSolicitud || new Date(),
      proveedor,
      comentario,
      pedir,
      introducidaSAP,
      aceptado,
      direccion,
      weeks,
      table_status,
      recepcionado,
      qrCode,
      ano: ano || new Date().getFullYear(),
    }

    // Create new Pedido
    const newPedido = new Pedido(newPedidoData)

    // Save will trigger the pre-save hook to populate material-related fields
    await newPedido.save()

    // Fetch the saved pedido with populated fields to return
    const savedPedido = await Pedido.findById(newPedido._id)
      .populate("tipo", "name")
      .populate("referencia", "description price")
      .populate("solicitante", "name email number")
      .populate("proveedor", "name")
      .populate("table_status", "name")

    res.status(201).json(savedPedido)
  } catch (error) {
    console.error("Error creating pedido:", error)
    res.status(500).json({ message: "Error creating pedido", error: error.message })
  }
}

// Get all pedidos with pagination, filtering, and search
exports.getAllPedidos = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "fechaSolicitud",
      sortOrder = -1,
      tipo,
      fabricante,
      proveedor,
      solicitante,
      recepcionado,
      pedir,
      anoDesde,
      anoHasta,
      fechaDesde,
      fechaHasta,
      table_status,
      minImporte,
      maxImporte,
    } = req.query

    // Ensure page & limit are valid positive integers
    page = Math.max(Number.parseInt(page, 10) || 1, 1)
    limit = Math.max(Number.parseInt(limit, 10) || 10, 1)

    // Build query filters
    const filter = {}

    // Text search if provided
    if (search && search.trim() !== "") {
      // First, try to find by exact QR code
      const exactMatch = await Pedido.findOne({ qrCode: search.trim() })

      if (exactMatch) {
        return res.status(200).json({
          total: 1,
          page: 1,
          limit,
          totalPages: 1,
          data: [exactMatch],
        })
      }

      // If no exact match, use text search
      if (mongoose.Types.ObjectId.isValid(search)) {
        // If search is a valid ObjectId, search in referenced fields
        const tipoMatches = await Tipo.find({
          $or: [{ _id: search }, { name: { $regex: search, $options: "i" } }],
        }).select("_id")

        const solicitanteMatches = await Solicitante.find({
          $or: [
            { _id: search },
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }).select("_id")

        const materialMatches = await Material.find({
          $or: [
            { _id: search },
            { reference: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }).select("_id")

        const supplierMatches = await Supplier.find({
          $or: [{ _id: search }, { name: { $regex: search, $options: "i" } }],
        }).select("_id")

        filter.$or = []

        if (tipoMatches.length > 0) {
          filter.$or.push({ tipo: { $in: tipoMatches.map((t) => t._id) } })
        }

        if (solicitanteMatches.length > 0) {
          filter.$or.push({ solicitante: { $in: solicitanteMatches.map((s) => s._id) } })
        }

        if (materialMatches.length > 0) {
          filter.$or.push({ referencia: { $in: materialMatches.map((m) => m._id) } })
        }

        if (supplierMatches.length > 0) {
          filter.$or.push({ proveedor: { $in: supplierMatches.map((p) => p._id) } })
        }

        // Also search in text fields
        filter.$or.push(
          { fabricante: { $regex: search, $options: "i" } },
          { descripcionInterna: { $regex: search, $options: "i" } },
          { descripcionProveedor: { $regex: search, $options: "i" } },
          { comentario: { $regex: search, $options: "i" } },
          { qrCode: { $regex: search, $options: "i" } },
        )
      } else {
        // If search is not a valid ObjectId, just search in text fields
        filter.$or = [
          { fabricante: { $regex: search, $options: "i" } },
          { descripcionInterna: { $regex: search, $options: "i" } },
          { descripcionProveedor: { $regex: search, $options: "i" } },
          { comentario: { $regex: search, $options: "i" } },
          { qrCode: { $regex: search, $options: "i" } },
        ]

        // Also search in referenced models
        const tipoMatches = await Tipo.find({ name: { $regex: search, $options: "i" } }).select("_id")
        const solicitanteMatches = await Solicitante.find({
          $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
        }).select("_id")
        const materialMatches = await Material.find({
          $or: [{ reference: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
        }).select("_id")
        const supplierMatches = await Supplier.find({ name: { $regex: search, $options: "i" } }).select("_id")

        if (tipoMatches.length > 0) {
          filter.$or.push({ tipo: { $in: tipoMatches.map((t) => t._id) } })
        }

        if (solicitanteMatches.length > 0) {
          filter.$or.push({ solicitante: { $in: solicitanteMatches.map((s) => s._id) } })
        }

        if (materialMatches.length > 0) {
          filter.$or.push({ referencia: { $in: materialMatches.map((m) => m._id) } })
        }

        if (supplierMatches.length > 0) {
          filter.$or.push({ proveedor: { $in: supplierMatches.map((p) => p._id) } })
        }
      }
    } else {
      // If no text search but specific field filters are provided, use them
      if (tipo) filter.tipo = tipo
      if (fabricante) filter.fabricante = fabricante
      if (proveedor) filter.proveedor = proveedor
      if (solicitante) filter.solicitante = solicitante
      if (table_status) filter.table_status = table_status
    }

    // These filters are always applied regardless of search
    if (recepcionado) filter.recepcionado = recepcionado
    if (pedir) filter.pedir = pedir

    // Date and year range filters
    if (anoDesde || anoHasta) {
      filter.ano = {}
      if (anoDesde) filter.ano.$gte = Number.parseInt(anoDesde)
      if (anoHasta) filter.ano.$lte = Number.parseInt(anoHasta)
    }

    if (fechaDesde || fechaHasta) {
      filter.fechaSolicitud = {}
      if (fechaDesde) filter.fechaSolicitud.$gte = new Date(fechaDesde)
      if (fechaHasta) filter.fechaSolicitud.$lte = new Date(fechaHasta)
    }

    // Price range filter
    if (minImporte !== undefined || maxImporte !== undefined) {
      filter.importePedido = {}
      if (minImporte !== undefined) filter.importePedido.$gte = Number.parseFloat(minImporte)
      if (maxImporte !== undefined) filter.importePedido.$lte = Number.parseFloat(maxImporte)
    }

    // Prepare sort options
    const sort = {}
    sort[sortBy] = Number.parseInt(sortOrder)

    // Count total matching documents (for pagination)
    const totalPedidos = await Pedido.countDocuments(filter)
    const totalPages = Math.ceil(totalPedidos / limit)

    // If the requested page is beyond available pages, return an empty array
    if (page > totalPages && totalPages > 0) {
      return res.json({
        total: totalPedidos,
        page,
        limit,
        totalPages,
        data: [], // Empty array if no results
      })
    }

    // Execute query with all filters, sorting, and pagination
    const pedidos = await Pedido.find(filter)
      .populate("tipo", "name")
      .populate("referencia", "description price reference")
      .populate("solicitante", "name email number")
      .populate("proveedor", "name")
      .populate("table_status", "name color")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean() // Use lean() for better performance

    res.json({
      total: totalPedidos,
      page,
      limit,
      totalPages,
      data: pedidos,
    })
  } catch (error) {
    console.error("Error fetching pedidos:", error)
    res.status(500).json({ message: "Error fetching pedidos", error: error.message })
  }
}

// Get a single pedido by ID
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("tipo", "name")
      .populate("referencia", "description price reference manufacturer")
      .populate("solicitante", "name email number")
      .populate("proveedor", "name contact email phone address")
      .populate("table_status", "name color")
      .lean()

    if (!pedido) return res.status(404).json({ message: "Pedido not found" })
    res.status(200).json(pedido)
  } catch (error) {
    console.error("Error fetching pedido by ID:", error)
    res.status(500).json({
      message: "Error fetching pedido details",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Update a pedido
exports.updatePedido = async (req, res) => {
  try {
    // Find the pedido first to check if it exists
    const existingPedido = await Pedido.findById(req.params.id)
    if (!existingPedido) {
      return res.status(404).json({ message: "Pedido not found" })
    }

    // If updating referencia, check if it exists
    if (req.body.referencia && req.body.referencia !== existingPedido.referencia.toString()) {
      const material = await Material.findById(req.body.referencia)
      if (!material) {
        return res.status(400).json({ error: "Material not found" })
      }
    }

    // If updating tipo, check if it exists
    if (req.body.tipo && req.body.tipo !== existingPedido.tipo.toString()) {
      const tipo = await Tipo.findById(req.body.tipo)
      if (!tipo) {
        return res.status(400).json({ error: "Tipo not found" })
      }
    }

    // If updating solicitante, check if it exists
    if (req.body.solicitante && req.body.solicitante !== existingPedido.solicitante.toString()) {
      const solicitante = await Solicitante.findById(req.body.solicitante)
      if (!solicitante) {
        return res.status(400).json({ error: "Solicitante not found" })
      }
    }

    // If updating proveedor, check if it exists
    if (
      req.body.proveedor &&
      req.body.proveedor !== (existingPedido.proveedor ? existingPedido.proveedor.toString() : null)
    ) {
      const proveedor = await Supplier.findById(req.body.proveedor)
      if (!proveedor) {
        return res.status(400).json({ error: "Supplier not found" })
      }
    }

    // If updating table_status, check if it exists
    if (
      req.body.table_status &&
      req.body.table_status !== (existingPedido.table_status ? existingPedido.table_status.toString() : null)
    ) {
      const tableStatus = await TableStatus.findById(req.body.table_status)
      if (!tableStatus) {
        return res.status(400).json({ error: "Table status not found" })
      }
    }

    // Update the pedido fields
    Object.keys(req.body).forEach((key) => {
      existingPedido[key] = req.body[key]
    })

    // Save the updated pedido (this will trigger the pre-save hook)
    await existingPedido.save()

    // Fetch the updated pedido with populated fields
    const updatedPedido = await Pedido.findById(req.params.id)
      .populate("tipo", "name")
      .populate("referencia", "description price reference")
      .populate("solicitante", "name email number")
      .populate("proveedor", "name")
      .populate("table_status", "name color")

    res.status(200).json(updatedPedido)
  } catch (error) {
    console.error("Error updating pedido:", error)
    res.status(400).json({ message: "Error updating pedido", error: error.message })
  }
}

// Delete a pedido
exports.deletePedido = async (req, res) => {
  try {
    const deletedPedido = await Pedido.findByIdAndDelete(req.params.id)
    if (!deletedPedido) return res.status(404).json({ message: "Pedido not found" })
    res.status(200).json({ message: "Pedido deleted successfully" })
  } catch (error) {
    console.error("Error deleting pedido:", error)
    res.status(500).json({ message: "Error deleting pedido", error: error.message })
  }
}

// Get filter options for dropdown menus
exports.getFilterOptions = async (req, res) => {
  try {
    const { field } = req.params

    // Only allow specific fields to be queried
    const allowedFields = [
      "tipo",
      "fabricante",
      "proveedor",
      "solicitante",
      "recepcionado",
      "pedir",
      "ano",
      "table_status",
    ]

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field for filter options" })
    }

    let options = []

    // For non-reference fields, use distinct
    if (field === "fabricante" || field === "recepcionado" || field === "pedir" || field === "ano") {
      options = await Pedido.distinct(field)
    } else {
      // For reference fields, we need to get the actual documents
      const distinctIds = await Pedido.distinct(field)

      switch (field) {
        case "tipo":
          options = await Tipo.find({ _id: { $in: distinctIds } })
            .select("name")
            .lean()
          break
        case "solicitante":
          options = await Solicitante.find({ _id: { $in: distinctIds } })
            .select("name email")
            .lean()
          break
        case "proveedor":
          options = await Supplier.find({ _id: { $in: distinctIds } })
            .select("name")
            .lean()
          break
        case "table_status":
          options = await TableStatus.find({ _id: { $in: distinctIds } })
            .select("name color")
            .lean()
          break
      }
    }

    res.status(200).json(options)
  } catch (error) {
    console.error("Error fetching filter options:", error)
    res.status(500).json({ message: "Error fetching filter options", error: error.message })
  }
}

// Get statistics for dashboard
exports.getPedidoStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear()

    // Count pedidos by status
    const statusCounts = await Pedido.aggregate([
      { $group: { _id: "$table_status", count: { $sum: 1 } } },
      { $lookup: { from: "tablestatuses", localField: "_id", foreignField: "_id", as: "status_info" } },
      { $unwind: { path: "$status_info", preserveNullAndEmptyArrays: true } },
      { $project: { status: "$status_info.name", color: "$status_info.color", count: 1, _id: 0 } },
    ])

    // Count pedidos by year
    const yearCounts = await Pedido.aggregate([
      { $group: { _id: "$ano", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $project: { year: "$_id", count: 1, _id: 0 } },
    ])

    // Count pedidos by tipo
    const tipoCounts = await Pedido.aggregate([
      { $group: { _id: "$tipo", count: { $sum: 1 } } },
      { $lookup: { from: "tipos", localField: "_id", foreignField: "_id", as: "tipo_info" } },
      { $unwind: { path: "$tipo_info", preserveNullAndEmptyArrays: true } },
      { $project: { tipo: "$tipo_info.name", count: 1, _id: 0 } },
    ])

    // Get total value of pedidos for current year
    const totalValue = await Pedido.aggregate([
      { $match: { ano: currentYear } },
      { $group: { _id: null, total: { $sum: "$importePedido" } } },
    ])

    // Get monthly totals for current year
    const monthlyTotals = await Pedido.aggregate([
      { $match: { ano: currentYear } },
      {
        $group: {
          _id: { $month: "$fechaSolicitud" },
          total: { $sum: "$importePedido" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { month: "$_id", total: 1, count: 1, _id: 0 } },
    ])

    // Get top solicitantes
    const topSolicitantes = await Pedido.aggregate([
      {
        $group: {
          _id: "$solicitante",
          count: { $sum: 1 },
          totalValue: { $sum: "$importePedido" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "solicitantes", localField: "_id", foreignField: "_id", as: "solicitante_info" } },
      { $unwind: { path: "$solicitante_info", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          solicitante: "$solicitante_info.name",
          email: "$solicitante_info.email",
          count: 1,
          totalValue: 1,
          _id: 0,
        },
      },
    ])

    res.status(200).json({
      statusCounts,
      yearCounts,
      tipoCounts,
      totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
      monthlyTotals,
      topSolicitantes,
    })
  } catch (error) {
    console.error("Error fetching pedido statistics:", error)
    res.status(500).json({ message: "Error fetching pedido statistics", error: error.message })
  }
}

// Bulk update pedidos
exports.bulkUpdatePedidos = async (req, res) => {
  try {
    const { ids, updates } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No pedido IDs provided" })
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" })
    }

    // Validate that all IDs exist
    const existingPedidos = await Pedido.find({ _id: { $in: ids } })
    if (existingPedidos.length !== ids.length) {
      return res.status(400).json({ error: "One or more pedidos not found" })
    }

    // Validate referenced fields if they're being updated
    if (updates.tipo) {
      const tipo = await Tipo.findById(updates.tipo)
      if (!tipo) {
        return res.status(400).json({ error: "Tipo not found" })
      }
    }

    if (updates.referencia) {
      const material = await Material.findById(updates.referencia)
      if (!material) {
        return res.status(400).json({ error: "Material not found" })
      }
    }

    if (updates.solicitante) {
      const solicitante = await Solicitante.findById(updates.solicitante)
      if (!solicitante) {
        return res.status(400).json({ error: "Solicitante not found" })
      }
    }

    if (updates.proveedor) {
      const proveedor = await Supplier.findById(updates.proveedor)
      if (!proveedor) {
        return res.status(400).json({ error: "Supplier not found" })
      }
    }

    if (updates.table_status) {
      const tableStatus = await TableStatus.findById(updates.table_status)
      if (!tableStatus) {
        return res.status(400).json({ error: "Table status not found" })
      }
    }

    // For bulk updates, we'll use updateMany for efficiency
    // Note: This won't trigger the pre-save hook, so we need to handle material-related fields manually
    if (
      updates.referencia &&
      (updates.precioUnidad === undefined ||
        updates.proveedor === undefined ||
        updates.descripcionProveedor === undefined)
    ) {
      const material = await Material.findById(updates.referencia)
      if (material) {
        if (updates.precioUnidad === undefined) updates.precioUnidad = material.price
        if (updates.proveedor === undefined) updates.proveedor = material.supplier
        if (updates.descripcionProveedor === undefined) updates.descripcionProveedor = material.description
      }
    }

    // Calculate importePedido if cantidad and precioUnidad are provided
    if (updates.cantidad !== undefined && updates.precioUnidad !== undefined) {
      updates.importePedido = updates.cantidad * updates.precioUnidad
    }

    const result = await Pedido.updateMany({ _id: { $in: ids } }, { $set: updates })

    res.status(200).json({
      message: `${result.modifiedCount} pedidos updated successfully`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error bulk updating pedidos:", error)
    res.status(500).json({ message: "Error bulk updating pedidos", error: error.message })
  }
}

// Export pedidos to CSV
exports.exportPedidos = async (req, res) => {
  try {
    const { ids } = req.query

    let filter = {}

    // If specific IDs are provided, filter by them
    if (ids) {
      const idArray = ids.split(",")
      filter = { _id: { $in: idArray } }
    }

    // Get pedidos with populated fields
    const pedidos = await Pedido.find(filter)
      .populate("tipo", "name")
      .populate("referencia", "description reference")
      .populate("solicitante", "name email")
      .populate("proveedor", "name")
      .populate("table_status", "name")
      .lean()

    // Create CSV header
    const csvHeader = [
      "ID",
      "Tipo",
      "Descripción Interna",
      "Fabricante",
      "Referencia",
      "Descripción Proveedor",
      "Solicitante",
      "Cantidad",
      "Precio Unidad",
      "Importe Pedido",
      "Fecha Solicitud",
      "Proveedor",
      "Comentario",
      "Pedir",
      "Introducida SAP",
      "Aceptado",
      "Dirección",
      "Semanas",
      "Estado",
      "Recepcionado",
      "QR Code",
      "Año",
    ].join(",")

    // Create CSV rows
    const csvRows = pedidos.map((pedido) => {
      return [
        pedido._id,
        pedido.tipo ? pedido.tipo.name : "",
        pedido.descripcionInterna || "",
        pedido.fabricante || "",
        pedido.referencia ? pedido.referencia.reference : "",
        pedido.descripcionProveedor || "",
        pedido.solicitante ? pedido.solicitante.name : "",
        pedido.cantidad || 0,
        pedido.precioUnidad || 0,
        pedido.importePedido || 0,
        pedido.fechaSolicitud ? new Date(pedido.fechaSolicitud).toISOString().split("T")[0] : "",
        pedido.proveedor ? pedido.proveedor.name : "",
        (pedido.comentario || "")
          .replace(/,/g, ";")
          .replace(/\n/g, " "), // Replace commas and newlines
        pedido.pedir || "",
        pedido.introducidaSAP ? new Date(pedido.introducidaSAP).toISOString().split("T")[0] : "",
        pedido.aceptado ? new Date(pedido.aceptado).toISOString().split("T")[0] : "",
        (pedido.direccion || "").replace(/,/g, ";"), // Replace commas
        pedido.weeks || "",
        pedido.table_status ? pedido.table_status.name : "",
        pedido.recepcionado || "",
        pedido.qrCode || "",
        pedido.ano || "",
      ].join(",")
    })

    // Combine header and rows
    const csv = [csvHeader, ...csvRows].join("\n")

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=pedidos_${new Date().toISOString().split("T")[0]}.csv`)

    // Send the CSV data
    res.send(csv)
  } catch (error) {
    console.error('Error exporting pedidos:", error);ng pedidos:', error)
    res.status(500).json({ message: "Error exporting pedidos", error: error.message })
  }
}

// Generate QR code for a pedido
exports.generateQRCode = async (req, res) => {
  try {
    const { id } = req.params

    // Find the pedido
    const pedido = await Pedido.findById(id)
    if (!pedido) {
      return res.status(404).json({ message: "Pedido not found" })
    }

    // Generate a unique QR code if it doesn't exist
    if (!pedido.qrCode) {
      // Create a unique code based on ID and timestamp
      const qrCode = `PED-${pedido._id.toString().slice(-6)}-${Date.now().toString().slice(-6)}`

      // Update the pedido with the QR code
      pedido.qrCode = qrCode
      await pedido.save()
    }

    res.status(200).json({
      qrCode: pedido.qrCode,
      pedidoId: pedido._id,
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    res.status(500).json({ message: "Error generating QR code", error: error.message })
  }
}

// Get pedidos by QR code
exports.getPedidoByQRCode = async (req, res) => {
  try {
    const { qrCode } = req.params

    const pedido = await Pedido.findOne({ qrCode })
      .populate("tipo", "name")
      .populate("referencia", "description price reference manufacturer")
      .populate("solicitante", "name email number")
      .populate("proveedor", "name contact email phone address")
      .populate("table_status", "name color")
      .lean()

    if (!pedido) {
      return res.status(404).json({ message: "Pedido not found" })
    }

    res.status(200).json(pedido)
  } catch (error) {
    console.error("Error fetching pedido by QR code:", error)
    res.status(500).json({ message: "Error fetching pedido", error: error.message })
  }
}

