"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var FeasabilityDetailSchema = new Schema({
  attribute_name: {
    type: String,
    required: true
  },
  // e.g., "product", "raw_material_type"
  description: {
    type: String,
    trim: true
  },
  cost: {
    type: Number
  },
  comments: {
    type: String,
    trim: true
  },
  sales_price: {
    type: Number
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("FeasabilityDetail", FeasabilityDetailSchema);