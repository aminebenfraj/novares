const express = require("express");
const { getAllPedidos, getPedidoById, createPedido, updatePedido, deletePedido, getFilterOptions } = require("../../controllers/pedidoController/pedidoController");
const router = express.Router();

// 📌 Define routes
router.get("/", getAllPedidos); // Get all pedidos
router.get("/:id", getPedidoById); // Get one pedido
router.post("/", createPedido); // Create new pedido
router.put("/:id", updatePedido); // Update pedido
router.delete("/:id", deletePedido); // Delete pedido
router.get("/filters/:field", getFilterOptions)
module.exports = router;
