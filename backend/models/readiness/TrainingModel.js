const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const TrainingSchema = new Schema(
  {
    visualControlQualification: { type: ValidationSubSchema, default: {} }, // Operator qualification for visual control
    dojoTrainingCompleted: { type: ValidationSubSchema, default: {} }, // DOJO training completed
    trainingPlanDefined: { type: ValidationSubSchema, default: {} }, // Training plan for product/process defined per ramp-up
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Training", TrainingSchema);
