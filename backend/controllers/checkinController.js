const Checkin = require("../models/CheckInModel");

// ✅ Create a Checkin Record
exports.createCheckin = async (req, res) => {
  try {
    const checkin = new Checkin(req.body);
    await checkin.save();
    res.status(201).json({ message: "Checkin created successfully", data: checkin });
  } catch (error) {
    res.status(500).json({ message: "Error creating checkin", error: error.message });
  }
};

// ✅ Get All Checkin Records
exports.getAllCheckins = async (req, res) => {
  try {
    const checkins = await Checkin.find();
    res.status(200).json(checkins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checkins", error: error.message });
  }
};

// ✅ Get Checkin by ID
exports.getCheckinById = async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id);
    if (!checkin) return res.status(404).json({ message: "Checkin not found" });
    res.status(200).json(checkin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checkin", error: error.message });
  }
};

// ✅ Update a Checkin Record
exports.updateCheckin = async (req, res) => {
  try {
    const updatedCheckin = await Checkin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCheckin) return res.status(404).json({ message: "Checkin not found" });
    res.status(200).json({ message: "Checkin updated successfully", data: updatedCheckin });
  } catch (error) {
    res.status(500).json({ message: "Error updating checkin", error: error.message });
  }
};

// ✅ Delete a Checkin Record
exports.deleteCheckin = async (req, res) => {
  try {
    const deletedCheckin = await Checkin.findByIdAndDelete(req.params.id);
    if (!deletedCheckin) return res.status(404).json({ message: "Checkin not found" });
    res.status(200).json({ message: "Checkin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting checkin", error: error.message });
  }
};
