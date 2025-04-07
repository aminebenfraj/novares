"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CheckinSchema = new Schema({
  project_manager: {
    type: Boolean,
    "default": false
  },
  business_manager: {
    type: Boolean,
    "default": false
  },
  engineering_leader_manager: {
    type: Boolean,
    "default": false
  },
  quality_leader: {
    type: Boolean,
    "default": false
  },
  plant_quality_leader: {
    type: Boolean,
    "default": false
  },
  industrial_engineering: {
    type: Boolean,
    "default": false
  },
  launch_manager_method: {
    type: Boolean,
    "default": false
  },
  maintenance: {
    type: Boolean,
    "default": false
  },
  purchasing: {
    type: Boolean,
    "default": false
  },
  logistics: {
    type: Boolean,
    "default": false
  },
  sales: {
    type: Boolean,
    "default": false
  },
  economic_financial_leader: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Checkin", CheckinSchema);