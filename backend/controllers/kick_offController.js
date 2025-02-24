const KickOff = require("../models/kick_off");
const Task = require("../models/Task");

const kickOffFields = [
  "timeScheduleApproved",
  "modificationLaunchOrder",
  "projectRiskAssessment",
  "standardsImpact",
  "validationOfCosts",
];

exports.createKickOff = async (req, res) => {
  try {
    console.log("📢 Received Kick-Off Data:", JSON.stringify(req.body, null, 2));

    const kickOffData = req.body;

    // ✅ Step 1: Create tasks separately and store their _ids
    const taskPromises = kickOffFields.map(async (field) => {
      if (kickOffData[field]?.task) {
        const newTask = new Task(kickOffData[field].task);
        await newTask.save();
        return newTask._id; // Return the task _id
      }
      return null;
    });

    const createdTaskIds = await Promise.all(taskPromises);

    // ✅ Step 2: Build the Kick-Off object with task _ids
    const formattedKickOffData = kickOffFields.reduce((acc, field, index) => {
      acc[field] = {
        value: kickOffData[field]?.value ?? false,
        task: createdTaskIds[index] || null, // Store only the ObjectId
      };
      return acc;
    }, {});

    // ✅ Step 3: Save the Kick-Off entry
    const newKickOff = new KickOff(formattedKickOffData);
    await newKickOff.save();

    console.log("✅ Kick-Off created successfully:", newKickOff);

    res.status(201).json({
      message: "Kick-Off created successfully",
      data: newKickOff,
    });

  } catch (error) {
    console.error("❌ Error creating Kick-Off:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
    
// **Get All Kick-Offs with Tasks**


exports.getAllKickOffs = async (req, res) => {
  try {
    console.log("📢 Fetching all Kick-Offs...")

    const kickOffs = await KickOff.find().populate({
      path: kickOffFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    console.log("✅ Kick-Offs fetched successfully:", kickOffs)

    res.status(200).json(kickOffs)
  } catch (error) {
    console.error("❌ Error fetching Kick-Offs:", error.message)
    res.status(500).json({ message: "Error fetching Kick-Offs", error: error.message })
  }
}
// **Get a Single Kick-Off with Tasks**
const mongoose = require("mongoose");

exports.getKickOffById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching Kick-Off for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Kick-Off ID format." });
    }

    const kickOff = await KickOff.findById(id)
      .populate({
        path: kickOffFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean();

    if (!kickOff) {
      return res.status(404).json({ message: "Kick-Off not found." });
    }

    res.status(200).json(kickOff);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// **Update Kick-Off and Tasks**
exports.updateKickOff = async (req, res) => {
  try {
    const kickOffData = req.body;
    const kickOffId = req.params.id;

    const existingKickOff = await KickOff.findById(kickOffId);
    if (!existingKickOff) {
      return res.status(404).json({ message: "Kick-Off not found" });
    }

    // Step 1: Update kick-off fields dynamically
    kickOffFields.forEach((field) => {
      existingKickOff[field].value = kickOffData[field]?.value ?? false;
    });

    await existingKickOff.save();

    // Step 2: Update Tasks dynamically
    await Promise.all(
      kickOffFields.map(async (field) => {
        if (kickOffData[field]?.task) {
          if (existingKickOff[field].task) {
            await Task.findByIdAndUpdate(existingKickOff[field].task, kickOffData[field].task, {
              new: true,
            });
          } else {
            const newTask = await Task.create(kickOffData[field].task);
            existingKickOff[field].task = newTask._id;
            await existingKickOff.save();
          }
        }
      })
    );

    res.status(200).json({ message: "Kick-Off and Tasks updated", data: existingKickOff });
  } catch (error) {
    res.status(500).json({ message: "Error updating Kick-Off", error: error.message });
  }
};

// **Delete Kick-Off and Associated Tasks**
exports.deleteKickOff = async (req, res) => {
  try {
    const kickOff = await KickOff.findById(req.params.id);
    if (!kickOff) {
      return res.status(404).json({ message: "Kick-Off not found" });
    }

    // Step 1: Delete the associated tasks
    const taskIds = kickOffFields.map((field) => kickOff[field]?.task).filter(Boolean);
    await Task.deleteMany({ _id: { $in: taskIds } });

    // Step 2: Delete the Kick-Off record itself
    await KickOff.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Kick-Off and associated tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Kick-Off", error: error.message });
  }
};
