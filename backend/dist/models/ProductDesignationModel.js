"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productDesignationSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  part_name: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    "default": null
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("ProductDesignation", productDesignationSchema);