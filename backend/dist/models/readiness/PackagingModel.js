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
var PackagingSchema = new Schema({
  customerDefined: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Packaging defined with customer
  smallBatchSubstitute: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Substitute packaging for small batches
  returnableLoops: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Logistic loops for returnable packaging
  rampUpReady: {
    type: ValidationSubSchema,
    "default": {}
  } // Packaging available and sufficient for ramp-up
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("Packaging", PackagingSchema);