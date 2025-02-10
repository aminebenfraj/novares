const mongoose = require("mongoose");

const { Schema } = mongoose;

const productDesignationSchema = new Schema({
id: {
    type: String,
    required: true,
    unique: true, 
  },
  part_name: {
    type: String,
    required: true,
  },
  reference: {
    type: String, 
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("ProductDesignation", productDesignationSchema);
