const mongoose = require("mongoose")

const PedidoSchema = new mongoose.Schema({
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: "Tipo", required: true },
  descripcionInterna: String,
  fabricante: { type: String, index: true },
  referencia: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true, default: null }, // Auto-filled from Material description
  descripcionProveedor: { type: String }, // Auto-filled from Material description
  solicitante: { type: mongoose.Schema.Types.ObjectId, ref: "Solicitante", required: true },
  cantidad: Number,
  precioUnidad: Number,
  importePedido: Number,
  fechaSolicitud: { type: Date, index: true },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }, // Auto-filled from Material supplier
  comentario: String,
  pedir: { type: String, index: true },
  introducidaSAP: Date,
  aceptado: Date,
  date_receiving: Date, // New field for receiving date (2 weeks after acceptance)
  direccion: String,
  weeks: { type: Number },
  table_status: { type: mongoose.Schema.Types.ObjectId, ref: "TableStatus" },
  recepcionado: { type: String, index: true },
  qrCode: { type: String }, // Will contain a QR code representing the Pedido ID
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

PedidoSchema.pre("save", async function (next) {
  if (this.referencia) {
    const Material = mongoose.model("Material")
    const material = await Material.findById(this.referencia).populate("supplier")
    if (material) {
      this.precioUnidad = material.price
      this.proveedor = material.supplier
      this.descripcionProveedor = material.description
    }
  }
  if (this.cantidad && this.precioUnidad) {
    this.importePedido = this.cantidad * this.precioUnidad
  }

  // Calculate date_receiving when aceptado is set
  if (this.aceptado && !this.date_receiving) {
    const acceptanceDate = new Date(this.aceptado)
    const receivingDate = new Date(acceptanceDate)
    receivingDate.setDate(acceptanceDate.getDate() + 14) // Add 2 weeks (14 days)
    this.date_receiving = receivingDate
  }

  next()
})

module.exports = mongoose.model("Pedido", PedidoSchema)

