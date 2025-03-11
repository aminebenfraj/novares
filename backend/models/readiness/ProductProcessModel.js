const mongoose = require("mongoose");
const { Schema } = mongoose;
const ValidationModel = require("./ValidationModel"); // Import Validation model
const ValidationSubSchema = new Schema(ValidationModel.schema.obj, { _id: false });

const ProductProcessSchema = new Schema(
  {
    technicalReview: { type: ValidationSubSchema, default: {} },
    dfmea: { type: ValidationSubSchema, default: {} },
    pfmea: { type: ValidationSubSchema, default: {} },
    injectionTools: { type: ValidationSubSchema, default: {} },
    paintingProcess: { type: ValidationSubSchema, default: {} },
    assyMachine: { type: ValidationSubSchema, default: {} },
    checkingFixture: { type: ValidationSubSchema, default: {} },
    industrialCapacity: { type: ValidationSubSchema, default: {} },
    skillsDeployment: { type: ValidationSubSchema, default: {} },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("ProductProcess", ProductProcessSchema);
