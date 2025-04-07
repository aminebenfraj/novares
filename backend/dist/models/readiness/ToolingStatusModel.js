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
var ToolingStatusSchema = new Schema({
  manufacturedPartsAtLastRelease: {
    type: ValidationSubSchema,
    "default": {}
  },
  specificationsConformity: {
    type: ValidationSubSchema,
    "default": {}
  },
  partsGrainedAndValidated: {
    type: ValidationSubSchema,
    "default": {}
  },
  noBreakOrIncidentDuringInjectionTrials: {
    type: ValidationSubSchema,
    "default": {}
  },
  toolsAccepted: {
    type: ValidationSubSchema,
    "default": {}
  },
  preSerialInjectionParametersDefined: {
    type: ValidationSubSchema,
    "default": {}
  },
  serialProductionInjectionParametersDefined: {
    type: ValidationSubSchema,
    "default": {}
  },
  incompletePartsProduced: {
    type: ValidationSubSchema,
    "default": {}
  },
  toolmakerIssuesEradicated: {
    type: ValidationSubSchema,
    "default": {}
  },
  checkingFixturesAvailable: {
    type: ValidationSubSchema,
    "default": {}
  }
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("ToolingStatus", ToolingStatusSchema);