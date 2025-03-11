const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const SafetySchema = new Schema(
  {
    industrialMeansCompliance: { type: ValidationSubSchema, default: {} },
    teamTraining: { type: ValidationSubSchema, default: {} },
    safetyOfficerInformed: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Safety", SafetySchema);
