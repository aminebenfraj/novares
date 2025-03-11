const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model

const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const PackagingSchema = new Schema(
  {
    customerDefined: { type: ValidationSubSchema, default: {} }, // Packaging defined with customer
    smallBatchSubstitute: { type: ValidationSubSchema, default: {} }, // Substitute packaging for small batches
    returnableLoops: { type: ValidationSubSchema, default: {} }, // Logistic loops for returnable packaging
    rampUpReady: { type: ValidationSubSchema, default: {} }, // Packaging available and sufficient for ramp-up
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Packaging", PackagingSchema);
