const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

// Reusable Validation Subdocument Schema
const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const MaintenanceSchema = new Schema(
  {
    sparePartsIdentifiedAndAvailable: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    processIntegratedInPlantMaintenance: { 
      type: ValidationSubSchema, 
      default: {} 
    },  
    maintenanceStaffTrained: { 
      type: ValidationSubSchema, 
      default: {} 
    }
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);