const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const RunAtRateProductionSchema = new Schema(
  {
    qualityWallInPlace: { type: ValidationSubSchema, default: {} }, // Quality Wall in place per Customer & NOVARES Std
    selfRunRatePerformed: { type: ValidationSubSchema, default: {} }, // Self Run@Rate performed, capacity meets customer expectations
    dimensionalInspectionsConform: { type: ValidationSubSchema, default: {} }, // Dimensional inspections done & conform
    rampUpDefined: { type: ValidationSubSchema, default: {} }, // Ramp-up phase clearly defined
    mppAuditCompleted: { type: ValidationSubSchema, default: {} }, // MPP audit performed & action plan closed
    reversePFMEACompleted: { type: ValidationSubSchema, default: {} }, // Reverse PFMEA completed
    paceBoardFollowUp: { type: ValidationSubSchema, default: {} }, // Pace Board follow-up for ramp-up
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("RunAtRateProduction", RunAtRateProductionSchema);
