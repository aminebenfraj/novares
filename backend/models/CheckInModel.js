const mongoose = require("mongoose")
const { Schema } = mongoose

const CheckinSchema = new Schema(
  {
    "Project Manager": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Business Manager": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Financial Leader": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Manufacturing Eng. Manager": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Manufacturing Eng. Leader": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Methodes UAP1&3": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Methodes UAP2": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Maintenance Manager": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Maintenance Leader UAP2": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Prod. Plant Manager UAP1": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Prod. Plant Manager UAP2": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Quality Manager": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Quality Leader UAP1": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Quality Leader UAP2": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    "Quality Leader UAP3": {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Checkin", CheckinSchema)
