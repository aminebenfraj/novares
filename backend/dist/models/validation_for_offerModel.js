"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validationForOfferSchema = new Schema({
  checkin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checkin",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  upload: {
    type: String,
    required: false
  },
  // File path or URL
  check: {
    type: Boolean,
    "default": false
  },
  date: {
    type: Date,
    "default": Date.now
  }
}, {
  timestamps: true
});

// ✅ Corrected variable name & model export
module.exports = mongoose.model("validationForOffer", validationForOfferSchema);