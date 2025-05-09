const mongoose = require("mongoose")
const { Schema } = mongoose
const FeasabilityDetail = require("./FeasabilityDetailModel")

// Reusable Schema for Feasibility Fields
const FeasibilityFieldSchema = new Schema({
  value: { type: Boolean, default: false },
  details: { type: Schema.Types.ObjectId, ref: "FeasabilityDetail", default: null },
})

// Main Feasibility Schema
const FeasabilitySchema = new Schema(
  {
    product: FeasibilityFieldSchema,
    raw_material_type: FeasibilityFieldSchema,
    raw_material_qty: FeasibilityFieldSchema,
    packaging: FeasibilityFieldSchema,
    purchased_part: FeasibilityFieldSchema,
    injection_cycle_time: FeasibilityFieldSchema,
    moulding_labor: FeasibilityFieldSchema,
    press_size: FeasibilityFieldSchema,
    assembly_finishing_paint_cycle_time: FeasibilityFieldSchema,
    assembly_finishing_paint_labor: FeasibilityFieldSchema,
    ppm_level: FeasibilityFieldSchema,
    pre_study: FeasibilityFieldSchema,
    project_management: FeasibilityFieldSchema,
    study_design: FeasibilityFieldSchema,
    cae_design: FeasibilityFieldSchema,
    monitoring: FeasibilityFieldSchema,
    measurement_metrology: FeasibilityFieldSchema,
    validation: FeasibilityFieldSchema,
    molds: FeasibilityFieldSchema,
    special_machines: FeasibilityFieldSchema,
    checking_fixture: FeasibilityFieldSchema,
    equipment_painting_prehension: FeasibilityFieldSchema,
    run_validation: FeasibilityFieldSchema,
    stock_production_coverage: FeasibilityFieldSchema,
    is_presentation: FeasibilityFieldSchema,
    documentation_update: FeasibilityFieldSchema,
    checkin: { type: Schema.Types.ObjectId, ref: "Checkin", required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Feasibility", FeasabilitySchema)

