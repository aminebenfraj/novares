const Pedido = require("../models/Pedido")

// 📌 Get all pedidos with pagination and advanced filtering
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
    } = req.query

    // Ensure page & limit are valid positive integers
    page = Math.max(Number.parseInt(page, 10) || 1, 1)
    limit = Math.max(Number.parseInt(limit, 10) || 10, 1)

    // Build query filters
    const filter = {}

    // Text search if provided - will search across tipo, referencia, solicitante, fabricante, proveedor
    if (search && search.trim() !== "") {
      // Use text search for the specific fields
      filter.$text = { $search: search }
    }

    // If no text search but specific field filters are provided, use them
    if (!search || search.trim() === "") {
      // Add specific filters if provided
      if (tipo) filter.tipo = tipo
      if (fabricante) filter.fabricante = fabricante
      if (proveedor) filter.proveedor = proveedor
      if (solicitante) filter.solicitante = solicitante
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

    // Prepare sort options
    const sort = {}
    sort[sortBy] = Number.parseInt(sortOrder)

    // If using text search, add score sorting as a secondary sort
    if (filter.$text) {
      sort.score = { $meta: "textScore" }
    }

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
    let query = Pedido.find(filter)

    // Add projection for text score if using text search
    if (filter.$text) {
      query = query.select({ score: { $meta: "textScore" } })
    }

    const pedidos = await query
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

// Alternative search implementation using regex for more flexible searching
exports.searchPedidos = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "fechaSolicitud", sortOrder = -1 } = req.query

    // Ensure page & limit are valid positive integers
    page = Math.max(Number.parseInt(page, 10) || 1, 1)
    limit = Math.max(Number.parseInt(limit, 10) || 10, 1)

    // Build query filters
    const filter = {}

    // If search term is provided, create a regex search across the specified fields
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i")
      filter.$or = [
        { tipo: searchRegex },
        { referencia: searchRegex },
        { solicitante: searchRegex },
        { fabricante: searchRegex },
        { proveedor: searchRegex },
      ]
    }

    // Prepare sort options
    const sort = {}
    sort[sortBy] = Number.parseInt(sortOrder)

    // Count total matching documents (for pagination)
    const totalPedidos = await Pedido.countDocuments(filter)
    const totalPages = Math.ceil(totalPedidos / limit)

    // Execute query with all filters, sorting, and pagination
    const pedidos = await Pedido.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    res.json({
      total: totalPedidos,
      page,
      limit,
      totalPages,
      data: pedidos,
    })
  } catch (error) {
    console.error("Error searching pedidos:", error)
    res.status(500).json({ message: "Error searching pedidos", error: error.message })
  }
}

// Rest of the controller methods remain the same...
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).lean()
    if (!pedido) return res.status(404).json({ message: "Pedido not found" })
    res.status(200).json(pedido)
  } catch (error) {
    res.status(500).json({ message: "Error fetching pedido", error: error.message })
  }
}

exports.createPedido = async (req, res) => {
  try {
    const newPedido = new Pedido(req.body)
    await newPedido.save()
    res.status(201).json(newPedido)
  } catch (error) {
    res.status(400).json({ message: "Error creating pedido", error: error.message })
  }
}

exports.updatePedido = async (req, res) => {
  try {
    const updatedPedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedPedido) return res.status(404).json({ message: "Pedido not found" })
    res.status(200).json(updatedPedido)
  } catch (error) {
    res.status(400).json({ message: "Error updating pedido", error: error.message })
  }
}

exports.deletePedido = async (req, res) => {
  try {
    const deletedPedido = await Pedido.findByIdAndDelete(req.params.id)
    if (!deletedPedido) return res.status(404).json({ message: "Pedido not found" })
    res.status(200).json({ message: "Pedido deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting pedido", error: error.message })
  }
}

exports.getFilterOptions = async (req, res) => {
  try {
    const { field } = req.params

    // Only allow specific fields to be queried
    const allowedFields = ["tipo", "fabricante", "proveedor", "solicitante", "recepcionado", "pedir", "ano"]

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field for filter options" })
    }

    const options = await Pedido.distinct(field)
    res.status(200).json(options)
  } catch (error) {
    res.status(500).json({ message: "Error fetching filter options", error: error.message })
  }
}

