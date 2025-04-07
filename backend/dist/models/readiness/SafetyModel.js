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
var SafetySchema = new Schema({
  industrialMeansCompliance: {
    type: ValidationSubSchema,
    "default": {}
  },
  teamTraining: {
    type: ValidationSubSchema,
    "default": {}
  },
  safetyOfficerInformed: {
    type: ValidationSubSchema,
    "default": {}
  }
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("Safety", SafetySchema);