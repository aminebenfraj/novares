const mongoose = require("mongoose");
const { Schema } = mongoose;

const supplierSchema = new Schema({
    companyName: { type: String, required: true },
    commercialContact: String,
    companyContact: String,
    technicalContact: String,
    name: String,
    businessPhone: String,
    officePhone: String,
    technicalPhone: String,
    companyEmail: String,
    businessEmail: String,
    technicalEmail: String,
  }, { timestamps: true });
  
  module.exports = mongoose.model('Supplier', supplierSchema);