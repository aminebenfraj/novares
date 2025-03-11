const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const LogisticsSchema = new Schema(
  {
    loopsFlowsDefined: { type: ValidationSubSchema, default: {} }, // Logistic loops and flows defined
    storageDefined: { type: ValidationSubSchema, default: {} }, // Storage areas defined and sufficient
    labelsCreated: { type: ValidationSubSchema, default: {} }, // Labels created and used
    sapReferenced: { type: ValidationSubSchema, default: {} }, // Production referenced under SAP (BOM)
    safetyStockReady: { type: ValidationSubSchema, default: {} }, // 5 days safety stock constructed
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Logistics", LogisticsSchema);
