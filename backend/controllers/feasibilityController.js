const Feasibility = require("../models/FeasabilityModel");
const FeasibilityDetail = require("../models/FeasabilityDetailModel");
const Checkin = require("../models/CheckInModel");

// List of all feasibility fields
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
  "documentation_update"
];

// **Create Feasibility with associated Check-in**
exports.createFeasibility = async (req, res) => {
  try {
    const feasibilityData = req.body;

    // Step 1: Create the Check-in
    const checkin = await Checkin.create(feasibilityData.checkin || {});

    // Step 2: Construct feasibility object dynamically
    const feasibilityObject = feasibilityFields.reduce((acc, field) => {
      acc[field] = {
        value: feasibilityData[field]?.value ?? false,
        details: null
      };
      return acc;
    }, {});

    // Step 3: Create Feasibility record
    const newFeasibility = new Feasibility({
      ...feasibilityObject,
      checkin: checkin._id,
    });

    await newFeasibility.save();

    // Step 4: Create FeasibilityDetails dynamically
    const feasibilityDetails = await Promise.all(
      feasibilityFields.map(async (field) => {
        if (feasibilityData[field]?.details) {
          const detail = await FeasibilityDetail.create({
            feasability_id: newFeasibility._id,
            attribute_name: field,
            description: feasibilityData[field]?.details?.description || `Detail for ${field}`,
            cost: feasibilityData[field]?.details?.cost || 0,
            sales_price: feasibilityData[field]?.details?.sales_price || 0,
            comments: feasibilityData[field]?.details?.comments || "",
          });

          newFeasibility[field].details = detail._id;
          return detail;
        }
      })
    );

    await newFeasibility.save();

    res.status(201).json({
      message: "Feasibility, Check-in, and details created successfully",
      data: {
        feasibility: newFeasibility,
        checkin: checkin,
        details: feasibilityDetails.filter(Boolean),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating feasibility", error: error.message });
  }
};

// **Get All Feasibilities with Check-in**
exports.getAllFeasibilities = async (req, res) => {
  try {
    console.log("📢 Fetching all feasibilities...");

    // Ensure feasibilityFields is defined before using it in populate()
    if (!Array.isArray(feasibilityFields) || feasibilityFields.length === 0) {
      throw new Error("feasibilityFields is not defined or empty.");
    }

    // Fetch feasibilities with related details
    const feasibilities = await Feasibility.find()
      .populate("checkin")
      .populate({
        path: feasibilityFields.map((field) => `${field}.details`).join(" "), // Join to avoid array issues
        model: "FeasabilityDetail",
      });

    res.status(200).json(feasibilities);
  } catch (error) {
    console.error("❌ Error fetching feasibilities:", error.message);
    res.status(500).json({ 
      message: "Error fetching feasibilities. Please try again later.", 
      error: error.message 
    });
  }
};


// **Get a Single Feasibility with its Check-in and Details**
const mongoose = require("mongoose");

exports.getFeasibilityById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching feasibility for ID:", id);

    // 1️⃣ **Validate MongoDB ObjectId**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ID format:", id);
      return res.status(400).json({ message: "Invalid feasibility ID format." });
    }

    // 2️⃣ **Ensure feasibilityFields is defined**
    if (!Array.isArray(feasibilityFields) || feasibilityFields.length === 0) {
      console.error("❌ feasibilityFields is not defined or empty.");
      return res.status(500).json({ message: "Server error: feasibilityFields is not set." });
    }

    // 3️⃣ **Query the database with `.populate()`**
    const feasibility = await Feasibility.findById(id)
      .populate("checkin")
      .populate({
        path: feasibilityFields.map((field) => `${field}.details`).join(" "), // Convert array to string
        model: "FeasabilityDetail",
      })
      .lean();

    // 4️⃣ **Handle Not Found**
    if (!feasibility) {
      console.warn("⚠️ Feasibility not found for ID:", id);
      return res.status(404).json({ message: "Feasibility not found." });
    }

    console.log("✅ Feasibility fetched successfully:", feasibility);
    res.status(200).json(feasibility);
  } catch (error) {
    console.error("❌ Error fetching feasibility:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Update Feasibility and Check-in**
exports.updateFeasibility = async (req, res) => {
  try {
    const feasibilityData = req.body;
    const feasibilityId = req.params.id;

    const existingFeasibility = await Feasibility.findById(feasibilityId);
    if (!existingFeasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Step 1: Update feasibility fields dynamically
    feasibilityFields.forEach((field) => {
      existingFeasibility[field].value = feasibilityData[field]?.value ?? false;
    });

    await existingFeasibility.save();

    // Step 2: Update FeasibilityDetails dynamically
    await Promise.all(
      feasibilityFields.map(async (field) => {
        if (feasibilityData[field]?.details) {
          if (existingFeasibility[field].details) {
            await FeasibilityDetail.findByIdAndUpdate(
              existingFeasibility[field].details,
              feasibilityData[field].details,
              { new: true }
            );
          } else {
            const newDetail = await FeasibilityDetail.create({
              feasability_id: feasibilityId,
              attribute_name: field,
              ...feasibilityData[field].details,
            });

            existingFeasibility[field].details = newDetail._id;
            await existingFeasibility.save();
          }
        }
      })
    );

    // Step 3: Update Check-in if provided
    if (feasibilityData.checkin) {
      await Checkin.findByIdAndUpdate(existingFeasibility.checkin, feasibilityData.checkin);
    }

    res.status(200).json({ message: "Feasibility and Check-in updated", data: existingFeasibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating feasibility", error: error.message });
  }
};

// **Delete Feasibility and its Associated Check-in**
exports.deleteFeasibility = async (req, res) => {
  try {
    const feasibility = await Feasibility.findById(req.params.id);
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Step 1: Delete the associated Check-in
    if (feasibility.checkin) {
      await Checkin.findByIdAndDelete(feasibility.checkin);
    }

    // Step 2: Delete related feasibility details
    await FeasibilityDetail.deleteMany({ feasability_id: req.params.id });

    // Step 3: Delete the feasibility record itself
    await Feasibility.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Feasibility, Check-in, and related details deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feasibility", error: error.message });
  }
};
