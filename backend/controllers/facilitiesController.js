const Facilities = require("../models/Facilities");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const facilityFields = [
  "reception_of_modified_means",
  "reception_of_modified_tools",
  "reception_of_modified_fixtures",
  "reception_of_modified_parts",
  "control_plan",
];

exports.createFacilities = async (req, res) => {
    try {
      console.log("📢 Received Facilities Data:", JSON.stringify(req.body, null, 2));
  
      const facilitiesData = req.body;
      if (!facilitiesData) {
        throw new Error("Facilities data is missing!");
      }
  
      console.log("✅ Step 1: Creating tasks...");
      const taskPromises = facilityFields.map(async (field) => {
        if (facilitiesData[field]?.task) {
          console.log(`📢 Creating task for ${field}`);
          const newTask = new Task(facilitiesData[field].task);
          await newTask.save();
          return newTask._id;
        }
        return null;
      });
  
      const createdTaskIds = await Promise.all(taskPromises);
      console.log("✅ Task creation completed:", createdTaskIds);
  
      console.log("✅ Step 2: Formatting Facilities Data...");
      const formattedFacilitiesData = facilityFields.reduce((acc, field, index) => {
        acc[field] = {
          value: facilitiesData[field]?.value ?? false,
          task: createdTaskIds[index] || null,
        };
        return acc;
      }, {});
  
      console.log("✅ Step 3: Saving Facilities...", formattedFacilitiesData);
      const newFacilities = new Facilities(formattedFacilitiesData);
      await newFacilities.save();
  
      console.log("✅ Facilities created successfully:", newFacilities);
      res.status(201).json({ message: "Facilities created successfully", data: newFacilities });
    } catch (error) {
      console.error("❌ Error creating Facilities:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  

  exports.getAllFacilities = async (req, res) => {
    try {
      console.log("📢 Fetching all Facilities...");
  
      const facilities = await Facilities.find().populate(
        facilityFields.map((field) => ({ path: `${field}.task`, model: "Task" }))
      );
  
      if (!facilities || facilities.length === 0) {
        return res.status(404).json({ message: "No facilities found." });
      }
  
      console.log("✅ Facilities fetched successfully:", facilities);
      res.status(200).json(facilities);
    } catch (error) {
      console.error("❌ Error fetching Facilities:", error.message);
      res.status(500).json({ message: "Error fetching Facilities", error: error.message });
    }
  };
exports.getFacilitiesById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Facilities for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Facilities ID format." });
    }

    const facilities = await Facilities.findById(id)
      .populate({
        path: facilityFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean();

    if (!facilities) {
      return res.status(404).json({ message: "Facilities not found." });
    }

    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateFacilities = async (req, res) => {
  try {
    const facilitiesData = req.body;
    const facilitiesId = req.params.id;

    const existingFacilities = await Facilities.findById(facilitiesId);
    if (!existingFacilities) {
      return res.status(404).json({ message: "Facilities not found" });
    }

    // Step 1: Update facilities fields dynamically
    facilityFields.forEach((field) => {
      existingFacilities[field].value = facilitiesData[field]?.value ?? false;
    });

    await existingFacilities.save();

    // Step 2: Update Tasks dynamically
    await Promise.all(
      facilityFields.map(async (field) => {
        if (facilitiesData[field]?.task) {
          if (existingFacilities[field].task) {
            await Task.findByIdAndUpdate(existingFacilities[field].task, facilitiesData[field].task, {
              new: true,
            });
          } else {
            const newTask = await Task.create(facilitiesData[field].task);
            existingFacilities[field].task = newTask._id;
            await existingFacilities.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Facilities and Tasks updated", data: existingFacilities });
  } catch (error) {
    res.status(500).json({ message: "Error updating Facilities", error: error.message });
  }
};

exports.deleteFacilities = async (req, res) => {
  console.log(req.params.id);
  try {
    const facilities = await Facilities.findById(req.params.id);
    if (!facilities) {
      return res.status(404).json({ message: "Facilities not found" });
    }

    // Step 1: Delete the associated tasks
    const taskIds = facilityFields.map((field) => facilities[field]?.task?._id).filter(Boolean);
    await Task.deleteMany({ _id: { $in: taskIds } });

    // Step 2: Delete the Facilities record itself
    await Facilities.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Facilities and associated tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Facilities", error: error.message });
  }
};
