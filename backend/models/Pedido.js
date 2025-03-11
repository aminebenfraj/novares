const mongoose = require("mongoose")

const PedidoSchema = new mongoose.Schema({
  tipo: { type: String, index: true },
  descripcionInterna: String,
  fabricante: { type: String, index: true },
  referencia: { type: String, index: true },
  descripcionProveedor: String,
  solicitante: { type: String, index: true },
  cantidad: Number,
  precioUnidad: Number,
  importePedido: Number,
  fechaSolicitud: { type: Date, index: true },
  proveedor: { type: String, index: true },
  comentario: String,
  pedir: { type: String, index: true },
  introducidaSAP: Date,
  aceptado: Date,
  direccion: String,
  recepcionado: { type: String, index: true },
  ano: { type: Number, index: true },
})

// Create a compound index for the most common search fields
PedidoSchema.index({
  referencia: 1,
  solicitante: 1,
  proveedor: 1,
  ano: 1,
})

// Create a text index specifically for the requested search fields
PedidoSchema.index({
  tipo: "text",
  referencia: "text",
  solicitante: "text",
  fabricante: "text",
  proveedor: "text",
})

module.exports = mongoose.model("Pedido", PedidoSchema)

