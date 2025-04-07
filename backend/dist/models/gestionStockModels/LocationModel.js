"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var locationSchema = new Schema({
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Location', locationSchema);