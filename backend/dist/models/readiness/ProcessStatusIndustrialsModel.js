"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ValidationModel = require("./ValidationModel"); // Import Validation model

// Reusable Validation Subdocument Schema
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
var ProcessStatusIndustrialsSchema = new Schema({
  processComplete: {
    type: ValidationSubSchema,
    "default": {}
  },
  processParametersIdentified: {
    type: ValidationSubSchema,
    "default": {}
  },
  pokaYokesIdentifiedAndEffective: {
    type: ValidationSubSchema,
    "default": {}
  },
  specificBoundaryPartsSamples: {
    type: ValidationSubSchema,
    "default": {}
  },
  gaugesAcceptedByPlant: {
    type: ValidationSubSchema,
    "default": {}
  },
  processCapabilitiesPerformed: {
    type: ValidationSubSchema,
    "default": {}
  },
  pfmeaIssuesAddressed: {
    type: ValidationSubSchema,
    "default": {}
  },
  reversePfmeaPerformed: {
    type: ValidationSubSchema,
    "default": {}
  },
  industrialMeansAccepted: {
    type: ValidationSubSchema,
    "default": {}
  }
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("ProcessStatusIndustrials", ProcessStatusIndustrialsSchema);