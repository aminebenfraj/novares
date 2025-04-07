"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ValidationModel = require("./ValidationModel"); // Import Validation model

var ValidationSubSchema = new Schema({
  value: {
    type: Boolean,
    "default": false,
    required: false
  },
  details: {
    type: Schema.Types.ObjectId,
    ref: "Validation",
    "default": null,
    required: false
  }
});
var SuppSchema = new Schema({
  componentsRawMaterialAvailable: {
    type: ValidationSubSchema,
    "default": {},
    required: false
  },
  packagingDefined: {
    type: ValidationSubSchema,
    "default": {},
    required: false
  },
  partsAccepted: {
    type: ValidationSubSchema,
    "default": {},
    required: false
  },
  purchasingRedFilesTransferred: {
    type: ValidationSubSchema,
    "default": {},
    required: false
  },
  automaticProcurementEnabled: {
    type: ValidationSubSchema,
    "default": {},
    required: false
  }
}, {
  timestamps: true,
  strict: false
});
module.exports = mongoose.model("Supp", SuppSchema);