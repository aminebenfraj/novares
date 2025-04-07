const mongoose = require("mongoose");
const { Schema } = mongoose;

const OkForLunchSchema = new Schema(
  {
    checkin: { type: mongoose.Schema.Types.ObjectId, ref: "Checkin", required: true },
    upload: { type: String, required: false }, // Assuming this is a file path or URL
    check: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OkForLunch", OkForLunchSchema);
