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
var MaintenanceSchema = new Schema({
  sparePartsIdentifiedAndAvailable: {
    type: ValidationSubSchema,
    "default": {}
  },
  processIntegratedInPlantMaintenance: {
    type: ValidationSubSchema,
    "default": {}
  },
  maintenanceStaffTrained: {
    type: ValidationSubSchema,
    "default": {}
  }
}, {
  timestamps: true,
  strict: true
});
module.exports = mongoose.model("Maintenance", MaintenanceSchema);