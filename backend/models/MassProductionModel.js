const mongoose = require("mongoose");
const { Schema } = mongoose;

const massProductionSchema = new Schema(
  {
    id: { type: String, required: true, index: true, trim: true, unique: true },
    status: { type: String, enum: ["cancelled", "closed", "on-going", "stand-by"], required: true },
    status_type: { type: String, enum: ["ok", "no"], required: true },
    project_n: { type: String, required: true, trim: true },
    product_designation: [{ type: Schema.Types.ObjectId, ref: "ProductDesignation" }],
    description: { type: String, trim: true },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    technical_skill: { type: String, enum: ["sc", "tc"] },
    initial_request: { type: Date, required: true },
    request_original: { type: String, enum: ["internal", "customer"] },
    feasability: { type: Schema.Types.ObjectId, ref: "Feasibility" },
    validation_for_offer: { type: Schema.Types.ObjectId, ref: "ValidationForOffer" },
    customer_offer: { type: String, enum: ["F", "E"] },
    customer_order: { type: String, enum: ["F", "E"] },
    ok_for_lunch: { type: Schema.Types.ObjectId, ref: "OkForLunch" },
    kick_off: { type: Schema.Types.ObjectId, ref: "KickOff" },
    design: { type: Schema.Types.ObjectId, ref: "Design" },
    facilities: { type: Schema.Types.ObjectId, ref: "Facilities" },
    p_p_tuning: { type: Schema.Types.ObjectId, ref: "P_P_Tuning" },
    process_qualif: { type: Schema.Types.ObjectId, ref: "ProcessQualif" },
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
    assignedRole: { type: String, required: true },
    assignedEmail: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual field for dynamically computing "days_until_ppap_submission"
massProductionSchema.virtual("days_until_ppap_submission").get(function () {
  if (!this.ppap_submission_date) return null;

  const today = new Date();
  const ppapDate = new Date(this.ppap_submission_date);
  return Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)));
});

massProductionSchema.index({ id: 1, createdAt: -1 });

module.exports = mongoose.model("MassProduction", massProductionSchema);
