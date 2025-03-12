const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "Validation", default: null }
});


const SupplierSchema = new Schema(
  {
    componentsRawMaterialAvailable: { type: ValidationSubSchema, default: {} },
    packagingDefined: { type: ValidationSubSchema, default: {} },
    partsAccepted: { type: ValidationSubSchema, default: {} },
    purchasingRedFilesTransferred: { type: ValidationSubSchema, default: {} },
    automaticProcurementEnabled: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);