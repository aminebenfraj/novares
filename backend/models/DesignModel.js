const mongoose = require("mongoose");
const { Schema } = mongoose;
const Task = require("./Task"); // Import Task model

// ✅ Define Reusable Kick-Off Field Schema
const kick_offSchema = new Schema({
  value: { type: Boolean, default: false },
  task: { type: Schema.Types.ObjectId, ref: "Task", default: null },
});

// ✅ Define Main Project Milestone Schema Using `kick_offSchema`
const DesignSchema = new Schema(
  {
    Validation_of_the_validation: kick_offSchema, 
    Modification_of_bought_product: kick_offSchema,
    Modification_of_tolerance: kick_offSchema,
    Modification_of_checking_fixtures: kick_offSchema, 
    Modification_of_Product_FMEA: kick_offSchema, 
    Modification_of_part_list_form: kick_offSchema, 
    Modification_of_Product_FMEA: kick_offSchema, 
    Modification_of_control_plan: kick_offSchema, 
    Modification_of_Process_FMEA: kick_offSchema, 
    Modification_of_production_facilities: kick_offSchema, 
    Modification_of_tools: kick_offSchema, 
    Modification_of_packaging: kick_offSchema, 
    Modification_of_information_system: kick_offSchema, 
    Updating_of_drawings: kick_offSchema, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", DesignSchema);
