"use strict";

var mongoose = require("mongoose");
var TableStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String
  },
  order: {
    type: Number
  }
});
module.exports = mongoose.model("TableStatus", TableStatusSchema);