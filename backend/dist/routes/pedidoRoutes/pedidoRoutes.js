"use strict";

var express = require("express");
var _require = require("../../controllers/pedidoController/pedidoController"),
  getAllPedidos = _require.getAllPedidos,
  getPedidoById = _require.getPedidoById,
  createPedido = _require.createPedido,
  updatePedido = _require.updatePedido,
  deletePedido = _require.deletePedido,
  getFilterOptions = _require.getFilterOptions,
  generateQRCode = _require.generateQRCode,
  getPedidoByQRCode = _require.getPedidoByQRCode;
var router = express.Router();

// 📌 Define routes
router.get("/", getAllPedidos); // Get all pedidos
router.get("/:id", getPedidoById); // Get one pedido
router.post("/", createPedido); // Create new pedido
router.put("/:id", updatePedido); // Update pedido
router["delete"]("/:id", deletePedido); // Delete pedido
router.get("/filters/:field", getFilterOptions);
router.get("/:id/qrcode", generateQRCode); // Generate QR code for a specific pedido
router.get("/qrcode/:qrCode", getPedidoByQRCode);
module.exports = router;