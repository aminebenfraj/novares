const mongoose = require("mongoose");

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, default: "customer", enum: ["customer"] }, // Always "customer"
  },
  { timestamps: true }
);

// 🔹 Index for faster lookups
customerSchema.index({ email: 1 });

module.exports = mongoose.model("Customer", customerSchema);
