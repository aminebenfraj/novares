"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ValidationModel = require("./ValidationModel"); // Import Validation model

var ValidationSubSchema = new Schema({
  value: {
    type: Boolean,
    "default": false
  },
  details: {
    type: Schema.Types.ObjectId,
    ref: "Validation",
    "default": null
  }
});
var DocumentationSchema = new Schema({
  workStandardsInPlace: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Work standards available in the workplace
  polyvalenceMatrixUpdated: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Polyvalence Matrix up to date (Operators & Leaders)
  gaugesAvailable: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Gauges in place, leaders trained, report sheets available
  qualityFileApproved: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Quality Assurance File completed & approved
  drpUpdated: {
    type: ValidationSubSchema,
    "default": {}
  } // Disaster Recovery Plan (DRP) updated
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("Documentation", DocumentationSchema);