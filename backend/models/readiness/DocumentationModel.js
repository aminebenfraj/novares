const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});

const DocumentationSchema = new Schema(
  {
    workStandardsInPlace: { type: ValidationSubSchema, default: {} }, // Work standards available in the workplace
    polyvalenceMatrixUpdated: { type: ValidationSubSchema, default: {} }, // Polyvalence Matrix up to date (Operators & Leaders)
    qualityFileApproved: { type: ValidationSubSchema, default: {} }, // Quality Assurance File completed & approved
    gaugesAvailable: { type: ValidationSubSchema, default: {} }, // Gauges in place, leaders trained, report sheets available
    drpUpdated: { type: ValidationSubSchema, default: {} }, // Disaster Recovery Plan (DRP) updated
    checkCSR :{ type: ValidationSubSchema, default: {} },
    dRP: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Documentation", DocumentationSchema);
