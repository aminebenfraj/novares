const mongoose = require("mongoose");

const { Schema } = mongoose;

const massProductionSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["cancelled", "closed", "on-going", "stand-by"],
    required: true,
  },
  status_type: {
    type: String,
    enum: ["ok", "no"],
    required: true,
  },
  project_n: {
    type: String,
    required: true,
  },
  product_designation: [
    {
        type: Schema.Types.ObjectId,
        ref: "ProductDesignation", 
    },
  ],
  description: {
    type: String, // Input field
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User", // References User collection, only where role = "customer"
  },
  technical_skill: {
    type: String,
    enum: ["sc", "tc"], // Radio Button
  },
  initial_request: {
    type: Date,
    required: true,
  },
  request_original: {
    type: String,
    enum: ["internal", "customer"], // Radio Button
  },
  frasability: { type: String, enum: ["F", "E"] },
  validation_for_offer: { type: String, enum: ["F", "E"] },
  customer_offer: { type: String, enum: ["F", "E"] },
  customer_order: { type: String, enum: ["F", "E"] },
  ok_for_lunch: { type: String, enum: ["F", "E"] },
  kick_off: { type: String, enum: ["F", "E"] },
  design: { type: String, enum: ["F", "E"] },
  facilities: { type: String, enum: ["F", "E"] },
  p_p_tuning: { type: String, enum: ["F", "E"] },
  process_qualif: { type: String, enum: ["F", "E"] },
  ppap_submission_date: { type: Date },
  ppap_submitted: { type: Boolean },
  closure: { type: Date },

  // 🔹 Closure Comparison (Computed Field)
  days_until_ppap_sub_date: {
    type: String,
    enum: ["ok", "no"],
    default: function () {
      return this.closure && this.closure < Date.now() ? "no" : "ok";
    },
  },

  comment: { type: String },
  next_review: { type: Date },

  // 🔹 Date Fields
  mlo: { type: Date },
  tko: { type: Date },
  cv: { type: Date },
  pt1: { type: Date },
  pt2: { type: Date },
  sop: { type: Date },
}, { timestamps: true });

// 🔹 Handling Multiple IDs with Filtering by Date
massProductionSchema.index({ id: 1, createdAt: -1 });

module.exports = mongoose.model("MassProduction", massProductionSchema);
