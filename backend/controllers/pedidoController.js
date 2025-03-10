const Pedido = require("../models/Pedido");

// 📌 Get all pedidos
// 📌 Get all pedidos with pagination
exports.getAllPedidos = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    // Ensure page & limit are valid positive integers
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalPedidos = await Pedido.countDocuments();
    const totalPages = Math.ceil(totalPedidos / limit);

    // If the requested page is beyond available pages, return an empty array
    if (page > totalPages) {
      return res.json({
        total: totalPedidos,
        page,
        limit,
        totalPages,
        data: [], // Empty array if no results
      });
    }

    const pedidos = await Pedido.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total: totalPedidos,
      page,
      limit,
      totalPages,
      data: pedidos,
    });
  } catch (error) {
    console.error("Error fetching pedidos:", error);
    res.status(500).json({ message: "Error fetching pedidos", error: error.message });
  }
};

// 📌 Get a single pedido by ID
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido not found" });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pedido", error });
  }
};

// 📌 Create a new pedido
exports.createPedido = async (req, res) => {
  try {
    const newPedido = new Pedido(req.body);
    await newPedido.save();
    res.status(201).json(newPedido);
  } catch (error) {
    res.status(400).json({ message: "Error creating pedido", error });
  }
};

// 📌 Update a pedido by ID
exports.updatePedido = async (req, res) => {
  try {
    const updatedPedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPedido) return res.status(404).json({ message: "Pedido not found" });
    res.status(200).json(updatedPedido);
  } catch (error) {
    res.status(400).json({ message: "Error updating pedido", error });
  }
};

// 📌 Delete a pedido by ID
exports.deletePedido = async (req, res) => {
  try {
    const deletedPedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!deletedPedido) return res.status(404).json({ message: "Pedido not found" });
    res.status(200).json({ message: "Pedido deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pedido", error });
  }
};
