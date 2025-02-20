const Feasibility = require('../models/FeasabilityModel');
const FeasibilityDetail = require('../models/FeasabilityDetailModel');
const Checkin = require('../models/CheckInModel'); // Import Check-in model

// Create Feasibility with associated Check-in
exports.createFeasibility = async (req, res) => {
  try {
    const feasibilityData = req.body;

    // Extract only boolean values for Feasibility model
    const feasibilityObject = Object.fromEntries(
      Object.entries(feasibilityData).map(([key, value]) => [key, value?.value ?? false])
    );

    // Step 1: Create the Check-in
    const checkin = await Checkin.create(feasibilityData.checkin || {});

    // Step 2: Create the Feasibility record with extracted boolean values & associate Check-in
    const newFeasibility = new Feasibility({
      ...feasibilityObject,
      checkin: checkin._id // Link check-in to feasibility
    });

    await newFeasibility.save();

    // Step 3: Extract all boolean fields dynamically
    const feasibilityFields = Object.keys(Feasibility.schema.paths).filter(
      (key) =>
        Feasibility.schema.paths[key].instance === "Boolean" &&
        key !== "_id" &&
        key !== "createdAt" &&
        key !== "updatedAt"
    );

    // Step 4: Create FeasibilityDetail records dynamically
    const feasibilityDetails = feasibilityFields.map((field) => ({
      feasability_id: newFeasibility._id,
      attribute_name: field,
      description: feasibilityData[field]?.description || `Detail for ${field}`,
      cost: feasibilityData[field]?.cost || 0,
      sales_price: feasibilityData[field]?.sales_price || 0,
      comments: feasibilityData[field]?.comments || ""
    }));

    // Step 5: Bulk insert feasibility details
    await FeasibilityDetail.insertMany(feasibilityDetails);

    res.status(201).json({
      message: "Feasibility, Check-in, and details created successfully",
      data: {
        feasibility: newFeasibility,
        checkin: checkin,
        details: feasibilityDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating feasibility", error: error.message });
  }
};

// Get All Feasibilities with Check-in
exports.getAllFeasibilities = async (req, res) => {
  try {
    // Fetch all feasibilities with their related feasibility details and check-in
    const feasibilities = await Feasibility.find().populate("checkin").populate("massProduction");

    res.status(200).json(feasibilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibilities", error: error.message });
  }
};

// Get a Single Feasibility with its Check-in and Details
exports.getFeasibilityById = async (req, res) => {
  try {
    // Fetch the Feasibility with Check-in
    const feasibility = await Feasibility.findById(req.params.id).populate("checkin").lean();
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Fetch all related FeasibilityDetail records
    const feasibilityDetails = await FeasibilityDetail.find({ feasability_id: req.params.id });

    // Structure response to include all details inside feasibility fields
    const formattedFeasibility = { ...feasibility, checkin: feasibility.checkin };

    Object.keys(feasibility).forEach((key) => {
      if (key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt" && key !== "checkin") {
        const detail = feasibilityDetails.find(detail => detail.attribute_name === key);

        formattedFeasibility[key] = {
          value: feasibility[key], // Boolean value
          ...(detail || {
            _id: null,
            feasability_id: feasibility._id,
            attribute_name: key,
            description: `Detail for ${key}`,
            cost: 0,
            sales_price: 0,
            comments: ""
          })
        };
      }
    });

    res.status(200).json(formattedFeasibility);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibility", error: error.message });
  }
};

// Update Feasibility and Check-in
exports.updateFeasibility = async (req, res) => {
  try {
    const feasibilityData = req.body;
    const feasibilityId = req.params.id;

    // Find the existing feasibility
    const existingFeasibility = await Feasibility.findById(feasibilityId);
    if (!existingFeasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Update the feasibility fields (excluding check-in)
    const feasibilityObject = Object.fromEntries(
      Object.entries(feasibilityData).map(([key, value]) => [key, value?.value ?? false])
    );

    const updatedFeasibility = await Feasibility.findByIdAndUpdate(
      feasibilityId,
      feasibilityObject,
      { new: true, runValidators: true }
    );

    // If there's an update for the check-in, update it separately
    if (feasibilityData.checkin) {
      await Checkin.findByIdAndUpdate(existingFeasibility.checkin, feasibilityData.checkin);
    }

    res.status(200).json({ message: "Feasibility and Check-in updated", data: updatedFeasibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating feasibility", error: error.message });
  }
};

// Delete Feasibility and its Associated Check-in
exports.deleteFeasibility = async (req, res) => {
  try {
    const feasibility = await Feasibility.findById(req.params.id);
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Delete the associated Check-in
    if (feasibility.checkin) {
      await Checkin.findByIdAndDelete(feasibility.checkin);
    }

    // Delete related feasibility details
    await FeasibilityDetail.deleteMany({ feasability_id: req.params.id });

    // Delete the feasibility record itself
    await Feasibility.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Feasibility, Check-in, and related details deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feasibility", error: error.message });
  }
};
