const OkForLunch = require("../models/ok_for_lunch");
const Checkin = require("../models/CheckInModel"); // ✅ Ensure this is correctly imported
const path = require("path");
const fs = require("fs");


// Create a new "OkForLunch" entry
exports.createOkForLunch = async (req, res) => {
  try {
    const { check, date } = req.body;
    const uploadPath = req.file ? req.file.path : null;

    // Create the Checkin entry first
    const newCheckin = new Checkin({});
    await newCheckin.save();

    // Now create the OkForLunch entry linked to the Checkin
    const newEntry = new OkForLunch({
      checkin: newCheckin._id, // Associate Checkin entry
      upload: uploadPath,
      check,
      date,
    });

    await newEntry.save();

    res.status(201).json({
      message: "OkForLunch and Checkin entries created successfully",
      data: newEntry,
      checkin: newCheckin
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all "OkForLunch" entries
exports.getAllOkForLunch = async (req, res) => {
  try {
    const entries = await OkForLunch.find().populate("checkin");
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single "OkForLunch" entry by ID
exports.getOkForLunchById = async (req, res) => {
  try {
    console.log("Fetching OkForLunch by ID:", req.params.id);
    const okForLunch = await OkForLunch.findById(req.params.id).populate("checkin");

    if (!okForLunch) {
      console.log("No OkForLunch found for ID:", req.params.id);
      return res.status(404).json({ message: "OkForLunch entry not found" });
    }

    res.status(200).json(okForLunch);
  } catch (error) {
    console.error("Error in getOkForLunchById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update "OkForLunch" entry
exports.updateOkForLunch = async (req, res) => {
  try {
    const { check, date, checkin } = req.body
    const uploadPath = req.file ? req.file.path : undefined

    // ✅ Find the existing OkForLunch entry
    const existingEntry = await OkForLunch.findById(req.params.id)
    if (!existingEntry) {
      return res.status(404).json({ message: "OkForLunch entry not found" })
    }

    // ✅ Update Checkin
    let updatedCheckin
    if (checkin && existingEntry.checkin) {
      updatedCheckin = await Checkin.findByIdAndUpdate(existingEntry.checkin, { $set: checkin }, { new: true })
    } else if (checkin) {
      // If there's no existing checkin, create a new one
      updatedCheckin = await Checkin.create(checkin)
    }

    // ✅ Update OkForLunch entry
    const updateData = {
      check,
      date,
      ...(uploadPath && { upload: uploadPath }),
      ...(updatedCheckin && { checkin: updatedCheckin._id }),
    }

    const updatedEntry = await OkForLunch.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate(
      "checkin",
    )

    res.status(200).json({
      message: "OkForLunch and Checkin updated successfully",
      data: updatedEntry,
    })
  } catch (error) {
    console.error("Error updating OkForLunch:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


// Delete "OkForLunch" entry
exports.deleteOkForLunch = async (req, res) => {
  try {
    const entry = await OkForLunch.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    // Delete the associated file
    if (entry.upload) {
      fs.unlink(entry.upload, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
