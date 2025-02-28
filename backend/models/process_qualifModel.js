const mongoose = require("mongoose");
const { Schema } = mongoose;
const Task = require("./Task"); // Import Task model


const taskSchema = new Schema({
    value: { type: Boolean, default: false },
    task: { type: Schema.Types.ObjectId, ref: "Task", default: null },
  });
  
const processQualifSchema = new Schema({
  updating_of_capms:  taskSchema ,
  modification_of_customer_logistics:  taskSchema ,
  qualification_of_supplier:  taskSchema ,
  presentation_of_initial_samples:  taskSchema ,
  filing_of_initial_samples:  taskSchema ,
  information_on_modification_implementation:  taskSchema ,
  full_production_run:  taskSchema ,
  request_for_dispensation:  taskSchema ,
  process_qualification:  taskSchema ,
  initial_sample_acceptance:  taskSchema ,
}, { timestamps: true });

module.exports = mongoose.model('ProcessQualif', processQualifSchema);
