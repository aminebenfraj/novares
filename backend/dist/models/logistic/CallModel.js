"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CallSchema = new Schema({
  machines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine"
  }],
  date: {
    type: Date,
    "default": Date.now
  },
  callTime: {
    type: Date,
    "default": Date.now
  },
  status: {
    type: String,
    "enum": ["Pendiente", "Realizada", "Expirada"],
    "default": "Pendiente"
  },
  completionTime: {
    type: Date,
    "default": null
  },
  createdBy: {
    type: String,
    required: true,
    "enum": ["PRODUCCION", "LOGISTICA"]
  }
}, {
  timestamps: true
});

// Virtual for remaining time (90 minutes from call time)
CallSchema.virtual("remainingTime").get(function () {
  if (this.status === "Realizada" || this.status === "Expirada") return 0;
  var callTime = new Date(this.callTime).getTime();
  var currentTime = new Date().getTime();
  var elapsedSeconds = Math.floor((currentTime - callTime) / 1000);
  var totalSeconds = 90 * 60; // 90 minutes in seconds

  var remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  return remainingSeconds;
});
module.exports = mongoose.model("Call", CallSchema);