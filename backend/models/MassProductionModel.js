const mongoose = require("mongoose");
const { Schema } = mongoose;

const massProductionSchema = new Schema(
  {
    id: { type: String, required: true, index: true, trim: true },
    status: { type: String, enum: ["cancelled", "closed", "on-going", "stand-by"], required: true },
    status_type: { type: String, enum: ["ok", "no"], required: true },
    project_n: { type: String, required: true, trim: true },
    product_designation: [{ type: Schema.Types.ObjectId, ref: "ProductDesignation" }],
    description: { type: String, trim: true },
    customer: { type: Schema.Types.ObjectId, ref: "User" }, // Reference User collection
    technical_skill: { type: String, enum: ["sc", "tc"] },
    initial_request: { type: Date, required: true },
    request_original: { type: String, enum: ["internal", "customer"] },
    frasability:  [{ type: Schema.Types.ObjectId, ref: "ProductDesignation" }],
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
    comment: { type: String, trim: true },
    next_review: { type: Date },
    mlo: { type: Date },
    tko: { type: Date },
    cv: { type: Date },
    pt1: { type: Date },
    pt2: { type: Date },
    sop: { type: Date },
    days_until_ppap_submission: { type: Number },
    assignedRole: { type: String, required: true },
    assignedEmail: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual field for "days_until_ppap_sub_date"
massProductionSchema.virtual("days_until_ppap_sub_date").get(function () {
  if (!this.ppap_submission_date) return "no";

  const today = new Date();
  return this.closure && this.closure < today ? "no" : "ok";
});

massProductionSchema.index({ id: 1, createdAt: -1 });

module.exports = mongoose.model("MassProduction", massProductionSchema);
