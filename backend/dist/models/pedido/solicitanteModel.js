"use strict";

var mongoose = require("mongoose");
var SolicitanteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Solicitante", SolicitanteSchema);