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
var LogisticsSchema = new Schema({
  loopsFlowsDefined: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Logistic loops and flows defined
  storageDefined: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Storage areas defined and sufficient
  labelsCreated: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Labels created and used
  sapReferenced: {
    type: ValidationSubSchema,
    "default": {}
  },
  // Production referenced under SAP (BOM)
  safetyStockReady: {
    type: ValidationSubSchema,
    "default": {}
  } // 5 days safety stock constructed
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("Logistics", LogisticsSchema);