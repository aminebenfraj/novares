"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Task = require("./Task"); // Import Task model

var taskSchema = new Schema({
  value: {
    type: Boolean,
    "default": false
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    "default": null
  }
});
var P_P_TuningSchema = new Schema({
  product_process_tuning: taskSchema,
  functional_validation_test: taskSchema,
  dimensional_validation_test: taskSchema,
  aspect_validation_test: taskSchema,
  supplier_order_modification: taskSchema,
  acceptation_of_supplier: taskSchema,
  capability: taskSchema,
  manufacturing_of_control_parts: taskSchema,
  product_training: taskSchema,
  process_training: taskSchema,
  purchase_file: taskSchema,
  means_technical_file_data: taskSchema,
  means_technical_file_manufacturing: taskSchema,
  means_technical_file_maintenance: taskSchema,
  tooling_file: taskSchema,
  product_file: taskSchema,
  internal_process: taskSchema
}, {
  timestamps: true
});
module.exports = mongoose.model("P_P_Tuning", P_P_TuningSchema);