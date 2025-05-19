const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const SafetySchema = new Schema(
  {
    industrialMeansCompliance: { type: ValidationSubSchema, default: {} },
    teamTraining: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Safety", SafetySchema);
