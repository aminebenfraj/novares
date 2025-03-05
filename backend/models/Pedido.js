const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  tipo: String,
  descripcionInterna: String,
  fabricante: String,
  referencia: String,
  descripcionProveedor: String,
  solicitante: String,
  cantidad: Number,
  precioUnidad: Number,
  importePedido: Number,
  fechaSolicitud: Date,
  proveedor: String,
  comentario: String,
  pedir: String,
  introducidaSAP: Date,
  aceptado: Date,
  direccion: String,
  recepcionPrevista: Date,
  recepcionado: String,
  ano: Number
});

module.exports = mongoose.model('Pedido', PedidoSchema);
