"use strict";

var mongoose = require("mongoose");
var TipoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});
module.exports = mongoose.model("Tipo", TipoSchema);