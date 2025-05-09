const OkForLunch = require("../models/OkForLunch")
const Checkin = require("../models/CheckInModel") // ✅ Ensure this is correctly imported
const path = require("path")
const fs = require("fs")

// Create a new "OkForLunch" entry
exports.createOkForLunch = async (req, res) => {
  try {
    const { check, date, checkin } = req.body
    const uploadPath = req.file ? req.file.path : null

    console.log("Received data:", { check, date, checkin })

    // Parse the checkin data if it's a string
    let checkinData = checkin
    if (typeof checkin === "string") {
      try {
        checkinData = JSON.parse(checkin)
      } catch (error) {
        console.error("Error parsing checkin JSON:", error)
        checkinData = {}
      }
    }

    // Create the Checkin entry with the provided checkin data
    const newCheckin = new Checkin(checkinData)
    await newCheckin.save()

    console.log("Created checkin:", newCheckin)

    // Now create the OkForLunch entry linked to the Checkin
    const newEntry = new OkForLunch({
      checkin: newCheckin._id,
      upload: uploadPath,
      check,
      date,
    })

    await newEntry.save()

    res.status(201).json({
      message: "OkForLunch and Checkin entries created successfully",
      data: newEntry,
      checkin: newCheckin,
    })
  } catch (error) {
    console.error("Error creating OkForLunch:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all "OkForLunch" entries
exports.getAllOkForLunch = async (req, res) => {
  try {
    const entries = await OkForLunch.find().populate("checkin")
    res.status(200).json(entries)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a single "OkForLunch" entry by ID
exports.getOkForLunchById = async (req, res) => {
  try {
    console.log("Fetching OkForLunch by ID:", req.params.id)
    const okForLunch = await OkForLunch.findById(req.params.id).populate("checkin")

    if (!okForLunch) {
      console.log("No OkForLunch found for ID:", req.params.id)
      return res.status(404).json({ message: "OkForLunch entry not found" })
    }

    res.status(200).json(okForLunch)
  } catch (error) {
    console.error("Error in getOkForLunchById:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.updateOkForLunch = async (req, res) => {
  try {
    const { check, date } = req.body;
    const uploadPath = req.file ? req.file.path : undefined;

    // ✅ Parse checkin if it's a JSON string
    let checkinData = req.body.checkin;
    if (typeof checkinData === "string") {
      try {
        checkinData = JSON.parse(checkinData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON in 'checkin' field" });
      }
    }

    // ✅ Find existing OkForLunch entry
    const existingEntry = await OkForLunch.findById(req.params.id);
    if (!existingEntry) {
      return res.status(404).json({ message: "OkForLunch entry not found" });
    }

    // ✅ Update or create Checkin
    if (checkinData && existingEntry.checkin) {
      await Checkin.findByIdAndUpdate(existingEntry.checkin, checkinData, { new: true });
    } else if (checkinData) {
      const newCheckin = await Checkin.create(checkinData);
      existingEntry.checkin = newCheckin._id;
    }

    // ✅ Build update object
    const updateData = {};
    if (check !== undefined) updateData.check = check;
    if (date !== undefined) updateData.date = date;
    if (uploadPath) updateData.upload = uploadPath;

    // ✅ Update OkForLunch entry
    const updatedEntry = await OkForLunch.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("checkin");

    res.status(200).json({
      message: "OkForLunch and Checkin updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating OkForLunch:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete "OkForLunch" entry
exports.deleteOkForLunch = async (req, res) => {
  try {
    const entry = await OkForLunch.findByIdAndDelete(req.params.id)
    if (!entry) return res.status(404).json({ message: "Entry not found" })

    // Delete the associated file
    if (entry.upload) {
      fs.unlink(entry.upload, (err) => {
        if (err) console.error("Failed to delete file:", err)
      })
    }

    res.status(200).json({ message: "Entry deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

