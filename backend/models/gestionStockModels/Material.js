
const mongoose = require("mongoose");
const { Schema } = mongoose;

const materialSchema = new Schema({
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    manufacturer: { type: String, trim: true },
    reference: { type: String, required: true },
    description: { type: String, trim: true },
    minimumStock: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    orderLot: { type: Number, required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    critical: { type: Boolean, default: false },
    consumable: { type: Boolean, default: false },
    machines: [{ type: Schema.Types.ObjectId, ref: 'Machine' }],
    comment: { type: String, trim: true },
    photo: { type: String, trim: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Material', materialSchema);
  