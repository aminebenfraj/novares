const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

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
    checkingFixturesAvailable: { type: ValidationSubSchema, default: {} },  
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("ToolingStatus", ToolingStatusSchema);
