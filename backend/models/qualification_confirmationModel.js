const mongoose = require("mongoose");
const { Schema } = mongoose;
const Task = require("./Task"); // Import Task model

const taskSchema = new Schema({
  value: { type: Boolean, default: false },
  task: { type: Schema.Types.ObjectId, ref: "Task", default: null },
});

const QualificationConfirmationSchema = new Schema(
  {
    using_up_old_stock: taskSchema,
    using_up_safety_stocks: taskSchema,
    updating_version_number_mould: taskSchema,
    updating_version_number_product_label: taskSchema,
    management_of_manufacturing_programmes: taskSchema,
    specific_spotting_of_packaging_with_label: taskSchema,
    management_of_galia_identification_labels: taskSchema,
    preservation_measure: taskSchema,
    product_traceability_label_modification: taskSchema,
    information_to_production: taskSchema,
    information_to_customer_logistics: taskSchema,
    information_to_customer_quality: taskSchema,
    updating_customer_programme_data_sheet: taskSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("QualificationConfirmation", QualificationConfirmationSchema);