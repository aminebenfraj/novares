const Pedido = require("../models/Pedido");

// 📌 Get all pedidos
// 📌 Get all pedidos with pagination
exports.getAllPedidos = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
  
      const pedidos = await Pedido.find()
        .skip((page - 1) * limit) // Skip previous pages
        .limit(parseInt(limit)) // Limit the number of results
        .sort({ createdAt: -1 }); // Sort by newest first
  
      const totalPedidos = await Pedido.countDocuments();
      
      res.json({
        total: totalPedidos,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalPedidos / limit),
        data: pedidos
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pedidos", error });
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
