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
var ProductProcessSchema = new Schema({
  technicalReview: {
    type: ValidationSubSchema,
    "default": {}
  },
  dfmea: {
    type: ValidationSubSchema,
    "default": {}
  },
  pfmea: {
    type: ValidationSubSchema,
    "default": {}
  },
  injectionTools: {
    type: ValidationSubSchema,
    "default": {}
  },
  paintingProcess: {
    type: ValidationSubSchema,
    "default": {}
  },
  assyMachine: {
    type: ValidationSubSchema,
    "default": {}
  },
  checkingFixture: {
    type: ValidationSubSchema,
    "default": {}
  },
  industrialCapacity: {
    type: ValidationSubSchema,
    "default": {}
  },
  skillsDeployment: {
    type: ValidationSubSchema,
    "default": {}
  }
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("ProductProcess", ProductProcessSchema);