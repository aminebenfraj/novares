const mongoose = require("mongoose")
const { Schema } = mongoose

const CheckinSchema = new Schema(
  {
    Project_Manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Business_Manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Financial_Leader: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Manufacturing_Eng_Manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Manufacturing_Eng_Leader: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Methodes_UAP1_3: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Methodes_UAP2: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Maintenance_Manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Maintenance_Leader_UAP2: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Prod_Plant_Manager_UAP1: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Prod_Plant_Manager_UAP2: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Quality_Manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Quality_Leader_UAP1: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Quality_Leader_UAP2: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
    Quality_Leader_UAP3: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      name: { type: String, default: "" },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Checkin", CheckinSchema)
