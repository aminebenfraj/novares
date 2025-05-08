const ValidationForOffer = require("../models/validation_for_offerModel");
const Checkin = require("../models/CheckInModel");
const path = require("path");
const fs = require("fs");

// ✅ Create a new "validationForOffer" entry
exports.createValidationForOffer = async (req, res) => {
  try {
    const { name, check, date, comments } = req.body;
    const uploadPath = req.file ? req.file.path : null;

    let checkinData = req.body.checkin;
    if (typeof checkinData === "string") {
      try {
        checkinData = JSON.parse(checkinData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON in 'checkin' field" });
      }
    }

    const newCheckin = new Checkin(checkinData);
    await newCheckin.save();

    const newValidation = new ValidationForOffer({
      name,
      check,
      date,
      comments,
      upload: uploadPath,
      checkin: newCheckin._id,
    });

    await newValidation.save();

    res.status(201).json({
      message: "ValidationForOffer and Checkin created successfully",
      data: newValidation,
      checkin: newCheckin,
    });
  } catch (error) {
    console.error("Error creating ValidationForOffer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all "validationForOffer" entries
exports.getAllValidationForOffers = async (req, res) => {
  try {
    const entries = await ValidationForOffer.find().populate("checkin");
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get a single "validationForOffer" entry by ID
exports.getValidationForOfferById = async (req, res) => {
  try {
    const validation = await ValidationForOffer.findById(req.params.id).populate("checkin");
    if (!validation) {
      return res.status(404).json({ message: "ValidationForOffer entry not found" });
    }
    res.status(200).json(validation);
  } catch (error) {
    console.error("Error in getValidationForOfferById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update "validationForOffer" entry
exports.updateValidationForOffer = async (req, res) => {
  try {
    const { name, check, date, comments } = req.body;
    const uploadPath = req.file ? req.file.path : undefined;

    let checkinData = req.body.checkin;
    if (typeof checkinData === "string") {
      try {
        checkinData = JSON.parse(checkinData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON in 'checkin' field" });
      }
    }

    const existingEntry = await ValidationForOffer.findById(req.params.id);
    if (!existingEntry) {
      return res.status(404).json({ message: "ValidationForOffer entry not found" });
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
    if (name !== undefined) updateData.name = name;
    if (check !== undefined) updateData.check = check;
    if (date !== undefined) updateData.date = date;
    if (comments !== undefined) updateData.comments = comments;
    if (uploadPath) updateData.upload = uploadPath;

    const updatedEntry = await ValidationForOffer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("checkin");

    res.status(200).json({
      message: "ValidationForOffer and Checkin updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating ValidationForOffer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete "validationForOffer" entry
exports.deleteValidationForOffer = async (req, res) => {
  try {
    const entry = await ValidationForOffer.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // ✅ Delete associated file
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
