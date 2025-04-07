const mongoose = require("mongoose");
const { Schema } = mongoose;
const Task = require("./Task"); // Import Task model

// ✅ Define Reusable Kick-Off Field Schema
const kick_offSchema = new Schema({
  value: { type: Boolean, default: false },
  task: { type: Schema.Types.ObjectId, ref: "Task", default: null },
});

// ✅ Define Main Project Milestone Schema Using `kick_offSchema`
const KickOffSchema = new Schema(
  {
    timeScheduleApproved: kick_offSchema, 
    modificationLaunchOrder: kick_offSchema,
    projectRiskAssessment: kick_offSchema,
    standardsImpact: kick_offSchema, 
    validationOfCosts: kick_offSchema, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("KickOff", KickOffSchema);
