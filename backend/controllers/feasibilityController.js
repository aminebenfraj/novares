const Feasibility = require("../models/FeasabilityModel");
const FeasibilityDetail = require("../models/FeasabilityDetailModel");
const Checkin = require("../models/CheckInModel");
const mongoose = require("mongoose");

const feasibilityFields = [
  "product",
  "raw_material_type",
  "raw_material_qty",
  "packaging",
  "purchased_part",
  "injection_cycle_time",
  "moulding_labor",
  "press_size",
  "assembly_finishing_paint_cycle_time",
  "assembly_finishing_paint_labor",
  "ppm_level",
  "pre_study",
  "project_management",
  "study_design",
  "cae_design",
  "monitoring",
  "measurement_metrology",
  "validation",
  "molds",
  "special_machines",
  "checking_fixture",
  "equipment_painting_prehension",
  "run_validation",
  "stock_production_coverage",
  "is_presentation",
  "documentation_update",
];

// ✅ Create Feasibility
exports.createFeasibility = async (req, res) => {
  try {
    const data = req.body;

    const checkin = await Checkin.create(data.checkin || {});

    const feasibilityObject = feasibilityFields.reduce((acc, field) => {
      acc[field] = { value: data[field]?.value ?? false, details: null };
      return acc;
    }, {});

    const newFeasibility = new Feasibility({ ...feasibilityObject, checkin: checkin._id });
    await newFeasibility.save();

    const details = await Promise.all(
      feasibilityFields.map(async (field) => {
        const detailData = data[field]?.details;
        if (detailData) {
          const detail = await FeasibilityDetail.create({
            attribute_name: field,
            description: detailData.description || "",
            cost: detailData.cost || 0,
            sales_price: detailData.sales_price || 0,
            comments: detailData.comments || "",
          });
          newFeasibility[field].details = detail._id;
          return detail;
        }
      })
    );

    await newFeasibility.save();

    res.status(201).json({
      message: "Feasibility created successfully",
      data: {
        feasibility: newFeasibility,
        checkin,
        details: details.filter(Boolean),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating feasibility", error: error.message });
  }
};

// ✅ Get All Feasibilities
exports.getAllFeasibilities = async (req, res) => {
  try {
    const feasibilities = await Feasibility.find()
      .populate("checkin")
      .populate(feasibilityFields.map((field) => ({ path: `${field}.details`, model: "FeasabilityDetail" })));

    res.status(200).json(feasibilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibilities", error: error.message });
  }
};

// ✅ Get Feasibility by ID
exports.getFeasibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const feasibility = await Feasibility.findById(id)
      .populate("checkin")
      .populate(feasibilityFields.map((field) => ({ path: `${field}.details`, model: "FeasabilityDetail" })))
      .lean();

    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found." });
    }

    res.status(200).json(feasibility);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibility", error: error.message });
  }
};

// ✅ Update Feasibility
exports.updateFeasibility = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const feasibility = await Feasibility.findById(id);
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Update main fields
    feasibilityFields.forEach((field) => {
      feasibility[field].value = data[field]?.value ?? false;
    });

    // Update details
    await Promise.all(
      feasibilityFields.map(async (field) => {
        const detailData = data[field]?.details;
        if (detailData) {
          if (feasibility[field].details) {
            await FeasibilityDetail.findByIdAndUpdate(feasibility[field].details, detailData, { new: true });
          } else {
            const newDetail = await FeasibilityDetail.create({
              attribute_name: field,
              ...detailData,
            });
            feasibility[field].details = newDetail._id;
          }
        }
      })
    );

    // Update checkin
    if (data.checkin) {
      await Checkin.findByIdAndUpdate(feasibility.checkin, data.checkin);
    }

    await feasibility.save();

    res.status(200).json({ message: "Feasibility updated", data: feasibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating feasibility", error: error.message });
  }
};

// ✅ Delete Feasibility
exports.deleteFeasibility = async (req, res) => {
  try {
    const feasibility = await Feasibility.findById(req.params.id);
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    await Checkin.findByIdAndDelete(feasibility.checkin);
    await FeasibilityDetail.deleteMany({ feasability_id: req.params.id });
    await Feasibility.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Feasibility deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feasibility", error: error.message });
  }
};
