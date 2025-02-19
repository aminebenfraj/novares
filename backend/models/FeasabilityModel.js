const mongoose = require("mongoose")
const { Schema } = mongoose

const FeasabilitySchema = new Schema(
  {
    product: { type: Boolean, default: false },
    raw_material_type: { type: Boolean, default: false },
    raw_material_qty: { type: Boolean, default: false },
    packaging: { type: Boolean, default: false },
    purchased_part: { type: Boolean, default: false },

    // Process Metrics
    injection_cycle_time: { type: Boolean, default: false },
    moulding_labor: { type: Boolean, default: false },
    press_size: { type: Boolean, default: false },
    assembly_finishing_paint_cycle_time: { type: Boolean, default: false },
    assembly_finishing_paint_labor: { type: Boolean, default: false },
    ppm_level: { type: Boolean, default: false },

    // Impact on Investment
    pre_study: { type: Boolean, default: false },
    project_management: { type: Boolean, default: false },
    study_design: { type: Boolean, default: false },
    cae_design: { type: Boolean, default: false },
    monitoring: { type: Boolean, default: false },
    measurement_metrology: { type: Boolean, default: false },
    validation: { type: Boolean, default: false },
    molds: { type: Boolean, default: false },
    special_machines: { type: Boolean, default: false },
    checking_fixture: { type: Boolean, default: false },
    equipment_painting_prehension: { type: Boolean, default: false },
    run_validation: { type: Boolean, default: false },
    stock_production_coverage: { type: Boolean, default: false },
    is_presentation: { type: Boolean, default: false },
    documentation_update: { type: Boolean, default: false },

    massProduction: { type: Schema.Types.ObjectId, ref: "MassProduction" },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Feasability", FeasabilitySchema)

