const ValidationForOffer = require("../models/validation_for_offerModel");
const Checkin = require("../models/CheckInModel"); // ✅ Ensure this is correctly imported
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

  // ✅ Create a new "validationForOffer" entry
  exports.createValidationForOffer = async (req, res) => {
    try {
      const { name, check, date, comments, checkin } = req.body
      const uploadPath = req.file ? req.file.path : null
  
      console.log("Received data:", { name, check, date, comments, checkin })
  
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
  
      // Create the ValidationForOffer entry linked to the Checkin
      const newEntry = new ValidationForOffer({
        checkin: newCheckin._id,
        name,
        upload: uploadPath,
        check,
        date,
        comments,
      })
  
      await newEntry.save()
  
      res.status(201).json({
        message: "ValidationForOffer and Checkin entries created successfully",
        data: newEntry,
        checkin: newCheckin,
      })
    } catch (error) {
      console.error("Error creating ValidationForOffer:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }
  


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
    console.log("Fetching ValidationForOffer by ID:", req.params.id);
    const validationForOffer = await ValidationForOffer.findById(req.params.id).populate("checkin");

    if (!validationForOffer) {
      console.log("No ValidationForOffer found for ID:", req.params.id);
      return res.status(404).json({ message: "ValidationForOffer entry not found" });
    }

    res.status(200).json(validationForOffer);
  } catch (error) {
    console.error("Error in getValidationForOfferById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update "validationForOffer" entry
exports.updateValidationForOffer = async (req, res) => {
  try {
    const { name, check, date, comments, checkin } = req.body;
    const uploadPath = req.file ? req.file.path : undefined;

    // ✅ Find the existing ValidationForOffer entry
    const existingEntry = await ValidationForOffer.findById(req.params.id);
    if (!existingEntry) {
      return res.status(404).json({ message: "ValidationForOffer entry not found" });
    }

    // ✅ Update Checkin if provided
    if (checkin && existingEntry.checkin) {
      await Checkin.findByIdAndUpdate(existingEntry.checkin, { $set: checkin }, { new: true });
    } else if (checkin) {
      const newCheckin = await Checkin.create(checkin);
      existingEntry.checkin = newCheckin._id;
    }

    // ✅ Update ValidationForOffer with provided fields
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete "validationForOffer" entry
exports.deleteValidationForOffer = async (req, res) => {
  try {
    const entry = await ValidationForOffer.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    // ✅ Delete the associated file if it exists
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
