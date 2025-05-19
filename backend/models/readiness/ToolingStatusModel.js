const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const ToolingStatusSchema = new Schema(
  {
    manufacturedPartsAtLastRelease: { type: ValidationSubSchema, default: {} },  
    specificationsConformity: { type: ValidationSubSchema, default: {} },  
    partsGrainedAndValidated: { type: ValidationSubSchema, default: {} },  
    noBreakOrIncidentDuringInjectionTrials: { type: ValidationSubSchema, default: {} },  
    toolsAccepted: { type: ValidationSubSchema, default: {} },  
    preSerialInjectionParametersDefined: { type: ValidationSubSchema, default: {} },  
    serialProductionInjectionParametersDefined: { type: ValidationSubSchema, default: {} },  
    incompletePartsProduced: { type: ValidationSubSchema, default: {} },  
    toolmakerIssuesEradicated: { type: ValidationSubSchema, default: {} },  
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("ToolingStatus", ToolingStatusSchema);
