const mongoose = require("mongoose");
const { Schema } = mongoose;

const readinessSchema = new Schema(
  {
    id: { type: String, required: true, index: true, trim: true, unique: true },
    project_number: { type: String, required: true, trim: true },
    part_designation: { type: String, trim: true },
    part_number: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["cancelled", "closed", "on-going", "stand-by"], required: true },
    Documentation: { type: Schema.Types.ObjectId, ref: "Documentation" },
    Logistics: { type: Schema.Types.ObjectId, ref: "Logistics" },
    Maintenance: { type: Schema.Types.ObjectId, ref: "Maintenance" },
    Packaging: { type: Schema.Types.ObjectId, ref: "Packaging" },
    ProcessStatusIndustrials: { type: Schema.Types.ObjectId, ref: "ProcessStatusIndustrials" },
    ProductProcess: { type: Schema.Types.ObjectId, ref: "ProductProcess" },
    RunAtRateProduction: { type: Schema.Types.ObjectId, ref: "RunAtRateProduction" },
    Safety: { type: Schema.Types.ObjectId, ref: "Safety" },
    Suppliers: { type: Schema.Types.ObjectId, ref: "Supp" },
    ToolingStatus: { type: Schema.Types.ObjectId, ref: "ToolingStatus" },
    Training: { type: Schema.Types.ObjectId, ref: "Training" },
    
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Readiness", readinessSchema);