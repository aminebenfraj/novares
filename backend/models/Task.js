const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  check: { type: Boolean, default: false },
  responsible: { type: String, required: false },
  planned: { type: Date, required: false },
  done: { type: Date },
  comments: { type: String },
  filePath: { type: String }
});

module.exports = mongoose.model("Task", TaskSchema);
