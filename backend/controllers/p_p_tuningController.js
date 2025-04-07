const P_P_Tuning = require("../models/pPTuningModel");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const p_p_tuningFields = [
  "product_process_tuning",
  "functional_validation_test",
  "dimensional_validation_test",
  "aspect_validation_test",
  "supplier_order_modification",
  "acceptation_of_supplier",
  "capability",
  "manufacturing_of_control_parts",
  "product_training",
  "process_training",
  "purchase_file",
  "means_technical_file_data",
  "means_technical_file_manufacturing",
  "means_technical_file_maintenance",
  "tooling_file",
  "product_file",
  "internal_process",
];

exports.createP_P_Tuning = async (req, res) => {
  try {
    console.log("📢 Received P_P_Tuning Data:", JSON.stringify(req.body, null, 2));

    const p_p_tuningData = req.body;
    if (!p_p_tuningData) {
      throw new Error("P_P_Tuning data is missing!");
    }

    console.log("✅ Step 1: Creating tasks...");
    const taskPromises = p_p_tuningFields.map(async (field) => {
      if (p_p_tuningData[field]?.task) {
        console.log(`📢 Creating task for ${field}`);
        const newTask = new Task(p_p_tuningData[field].task);
        await newTask.save();
        return newTask._id;
      }
      return null;
    });

    const createdTaskIds = await Promise.all(taskPromises);
    console.log("✅ Task creation completed:", createdTaskIds);

    console.log("✅ Step 2: Formatting P_P_Tuning Data...");
    const formattedP_P_TuningData = p_p_tuningFields.reduce((acc, field, index) => {
      acc[field] = {
        value: p_p_tuningData[field]?.value ?? false,
        task: createdTaskIds[index] || null,
      };
      return acc;
    }, {});

    console.log("✅ Step 3: Saving P_P_Tuning...", formattedP_P_TuningData);
    const newP_P_Tuning = new P_P_Tuning(formattedP_P_TuningData);
    await newP_P_Tuning.save();

    console.log("✅ P_P_Tuning created successfully:", newP_P_Tuning);
    res.status(201).json({ message: "P_P_Tuning created successfully", data: newP_P_Tuning });
  } catch (error) {
    console.error("❌ Error creating P_P_Tuning:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAllP_P_Tuning = async (req, res) => {
  try {
    console.log("📢 Fetching all P_P_Tuning...");

    const p_p_tuning = await P_P_Tuning.find().populate(
      p_p_tuningFields.map((field) => ({ path: `${field}.task`, model: "Task" }))
    );

    if (!p_p_tuning || p_p_tuning.length === 0) {
      return res.status(404).json({ message: "No P_P_Tuning found." });
    }

    console.log("✅ P_P_Tuning fetched successfully:", p_p_tuning);
    res.status(200).json(p_p_tuning);
  } catch (error) {
    console.error("❌ Error fetching P_P_Tuning:", error.message);
    res.status(500).json({ message: "Error fetching P_P_Tuning", error: error.message });
  }
};

exports.getP_P_TuningById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📢 Fetching P_P_Tuning for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid P_P_Tuning ID format." });
    }

    const p_p_tuning = await P_P_Tuning.findById(id)
      .populate({
        path: p_p_tuningFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean();

    if (!p_p_tuning) {
      return res.status(404).json({ message: "P_P_Tuning not found." });
    }

    res.status(200).json(p_p_tuning);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateP_P_Tuning = async (req, res) => {
  try {
    const p_p_tuningData = req.body;
    const p_p_tuningId = req.params.id;

    const existingP_P_Tuning = await P_P_Tuning.findById(p_p_tuningId);
    if (!existingP_P_Tuning) {
      return res.status(404).json({ message: "P_P_Tuning not found" });
    }

    // Step 1: Update P_P_Tuning fields dynamically
    p_p_tuningFields.forEach((field) => {
      existingP_P_Tuning[field].value = p_p_tuningData[field]?.value ?? false;
    });

    await existingP_P_Tuning.save();

    // Step 2: Update Tasks dynamically
    await Promise.all(
      p_p_tuningFields.map(async (field) => {
        if (p_p_tuningData[field]?.task) {
          if (existingP_P_Tuning[field].task) {
            await Task.findByIdAndUpdate(existingP_P_Tuning[field].task, p_p_tuningData[field].task, {
              new: true,
            });
          } else {
            const newTask = await Task.create(p_p_tuningData[field].task);
            existingP_P_Tuning[field].task = newTask._id;
            await existingP_P_Tuning.save();
          }
        }
      })
    );

    res.status(200).json({ message: "P_P_Tuning and Tasks updated", data: existingP_P_Tuning });
  } catch (error) {
    res.status(500).json({ message: "Error updating P_P_Tuning", error: error.message });
  }
};

exports.deleteP_P_Tuning = async (req, res) => {
  console.log(req.params.id);
  try {
    const p_p_tuning = await P_P_Tuning.findById(req.params.id);
    if (!p_p_tuning) {
      return res.status(404).json({ message: "P_P_Tuning not found" });
    }

    // Step 1: Delete the associated tasks
    const taskIds = p_p_tuningFields.map((field) => p_p_tuning[field]?.task?._id).filter(Boolean);
    await Task.deleteMany({ _id: { $in: taskIds } });

    // Step 2: Delete the P_P_Tuning record itself
    await P_P_Tuning.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "P_P_Tuning and associated tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting P_P_Tuning", error: error.message });
  }
};