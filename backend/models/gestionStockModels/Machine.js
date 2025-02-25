const mongoose = require("mongoose");
const { Schema } = mongoose;

const machineSchema = new Schema({
    number: { type: String, required: true },
    description: String,
  }, { timestamps: true });
  
  module.exports = mongoose.model('Machine', machineSchema);