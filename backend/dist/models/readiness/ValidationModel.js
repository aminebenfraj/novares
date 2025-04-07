"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ValidationSchema = new Schema({
  tko: {
    type: Boolean,
    "default": false,
    required: false
  },
  ot: {
    type: Boolean,
    "default": false,
    required: false
  },
  ot_op: {
    type: Boolean,
    "default": false,
    required: false
  },
  is: {
    type: Boolean,
    "default": false,
    required: false
  },
  sop: {
    type: Boolean,
    "default": false,
    required: false
  },
  ok_nok: {
    type: String,
    "enum": ["OK", "NOK", ""],
    "default": "",
    required: false
  },
  who: {
    type: String,
    "default": "",
    required: false
  },
  when: {
    type: String,
    "default": "",
    required: false
  },
  validation_check: {
    type: Boolean,
    "default": false,
    required: false
  },
  comment: {
    type: String,
    "default": "",
    required: false
  }
}, {
  timestamps: true,
  strict: false
});
module.exports = mongoose.model("Validation", ValidationSchema);