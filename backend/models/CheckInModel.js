const mongoose = require("mongoose");
const { Schema } = mongoose;

const CheckinSchema = new Schema(
  {
    project_manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }

    },
    business_manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
                        name: { type: String, default: "" }

    },
    engineering_leader_manager: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }


    },
    quality_leader: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }

    },
    plant_quality_leader: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }


    },
    industrial_engineering: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }

    },
    launch_manager_method: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      date: { type: Date, default: Date.now },
                  name: { type: String, default: "" }


    },
    maintenance: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
                        name: { type: String, default: "" }


    },
    purchasing: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
                        name: { type: String, default: "" }


    },
    logistics: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
                        name: { type: String, default: "" }


    },
    sales: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
                        name: { type: String, default: "" }


    },
    economic_financial_leader: {
      value: { type: Boolean, default: false },
      comment: { type: String, default: "" },
            date: { type: Date, default: Date.now },
            name: { type: String, default: "" }

    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkin", CheckinSchema);
