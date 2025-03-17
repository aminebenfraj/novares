const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const RunAtRateProductionSchema = new Schema(
  {
    qualityWallInPlace: { type: ValidationSubSchema, default: {} },
    selfRunRatePerformed: { type: ValidationSubSchema, default: {} }, 
    dimensionalInspectionsConform: { type: ValidationSubSchema, default: {} }, 
    rampUpDefined: { type: ValidationSubSchema, default: {} }, 
    mppAuditCompleted: { type: ValidationSubSchema, default: {} }, 
    reversePFMEACompleted: { type: ValidationSubSchema, default: {} }, 
    paceBoardFollowUp: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("RunAtRateProduction", RunAtRateProductionSchema);
