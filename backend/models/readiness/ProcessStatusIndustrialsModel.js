const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

// Reusable Validation Subdocument Schema
const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const ProcessStatusIndustrialsSchema = new Schema(
  {
    processComplete: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    processParametersIdentified: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    pokaYokesIdentifiedAndEffective: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    specificBoundaryPartsSamples: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    gaugesAcceptedByPlant: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    processCapabilitiesPerformed: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    pfmeaIssuesAddressed: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    reversePfmeaPerformed: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    industrialMeansAccepted: { 
      type: ValidationSubSchema, 
      default: {} 
    }
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("ProcessStatusIndustrials", ProcessStatusIndustrialsSchema);