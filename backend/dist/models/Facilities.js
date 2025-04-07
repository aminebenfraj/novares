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
var FacilitiesSchema = new Schema({
  reception_of_modified_means: taskSchema,
  reception_of_modified_tools: taskSchema,
  reception_of_modified_fixtures: taskSchema,
  reception_of_modified_parts: taskSchema,
  control_plan: taskSchema
}, {
  timestamps: true
});
module.exports = mongoose.model("Facilities", FacilitiesSchema);