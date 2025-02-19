const Feasibility = require('../models/FeasabilityModel');
const FeasibilityDetail = require('../models/FeasabilityDetailModel');

exports.createFeasibility = async (req, res) => {
    try {
      const feasibilityData = req.body;
  
      // Extract only boolean values for Feasibility model
      const feasibilityObject = Object.fromEntries(
        Object.entries(feasibilityData).map(([key, value]) => [key, value?.value ?? false])
      );
  
      // Step 2: Create the Feasibility record with extracted boolean values
      const newFeasibility = new Feasibility(feasibilityObject);
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
        message: "Feasibility and details created successfully",
        data: {
          feasibility: newFeasibility,
          details: feasibilityDetails
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating feasibility", error: error.message });
    }
  };


exports.getAllFeasibilities = async (req, res) => {
  try {
    // Fetch all feasibilities with their related feasibility details
    const feasibilities = await Feasibility.find().populate("massProduction");

    res.status(200).json(feasibilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibilities", error: error.message });
  }
};

exports.getFeasibilityById = async (req, res) => {
  try {
    // Step 1: Fetch the Feasibility record by ID
    const feasibility = await Feasibility.findById(req.params.id).lean();
    if (!feasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Step 2: Fetch all related FeasibilityDetail records
    const feasibilityDetails = await FeasibilityDetail.find({ feasability_id: req.params.id });

    // Step 3: Structure the response to include all details inside feasibility fields
    const formattedFeasibility = {};

    // Loop through feasibility fields and include associated details
    Object.keys(feasibility).forEach((key) => {
      if (key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
        const detail = feasibilityDetails.find(detail => detail.attribute_name === key);

        // Assign boolean value + feasibility detail (or default if missing)
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


exports.updateFeasibility = async (req, res) => {
  try {
    const updatedFeasibility = await Feasibility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    res.status(200).json({ message: "Feasibility updated", data: updatedFeasibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating feasibility", error: error.message });
  }
};

exports.deleteFeasibility = async (req, res) => {
  try {
    const deletedFeasibility = await Feasibility.findByIdAndDelete(req.params.id);
    if (!deletedFeasibility) {
      return res.status(404).json({ message: "Feasibility not found" });
    }

    // Delete related feasibility details
    await FeasibilityDetail.deleteMany({ feasability_id: req.params.id });

    res.status(200).json({ message: "Feasibility and related details deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feasibility", error: error.message });
  }
};
