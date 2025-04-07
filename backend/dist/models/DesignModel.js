"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Task = require("./Task"); // Import Task model

// ✅ Define Reusable Kick-Off Field Schema
var kick_offSchema = new Schema({
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

// ✅ Define Main Project Milestone Schema Using `kick_offSchema`
var DesignSchema = new Schema(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
  Validation_of_the_validation: kick_offSchema,
  Modification_of_bought_product: kick_offSchema,
  Modification_of_tolerance: kick_offSchema,
  Modification_of_checking_fixtures: kick_offSchema,
  Modification_of_Product_FMEA: kick_offSchema,
  Modification_of_part_list_form: kick_offSchema
}, "Modification_of_Product_FMEA", kick_offSchema), "Modification_of_control_plan", kick_offSchema), "Modification_of_Process_FMEA", kick_offSchema), "Modification_of_production_facilities", kick_offSchema), "Modification_of_tools", kick_offSchema), "Modification_of_packaging", kick_offSchema), "Modification_of_information_system", kick_offSchema), "Updating_of_drawings", kick_offSchema), {
  timestamps: true
});
module.exports = mongoose.model("Design", DesignSchema);