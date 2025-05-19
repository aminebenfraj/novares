const mongoose = require("mongoose");
const { Schema } = mongoose;

const ValidationSchema = new Schema(
  {
    ok_nok: {
      type: String,
      enum: ["OK", "NOK", ""],
      default: "",
      required: false,
    },
    who: { type: String, default: "", required: false },
    when: { type: Date, default: null, required: false }, // Changed to Date
    validation_check: { type: Boolean, default: false, required: false },
    comment: { type: String, default: "", required: false },
  },
  { timestamps: true, strict: false },
);

module.exports = mongoose.model("Validation", ValidationSchema);
