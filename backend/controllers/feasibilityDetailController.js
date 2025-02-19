// controllers/feasibilityDetailController.js
const FeasibilityDetail = require('../models/FeasabilityDetailModel');

exports.createFeasibilityDetail = async (req, res) => {
  try {
    const newFeasibilityDetail = new FeasibilityDetail(req.body);
    await newFeasibilityDetail.save();
    res.status(201).json({ message: "Feasibility detail created", data: newFeasibilityDetail });
  } catch (error) {
    res.status(500).json({ message: "Error creating feasibility detail", error: error.message });
  }
};

exports.getAllFeasibilityDetails = async (req, res) => {
  try {
    const feasibilityDetails = await FeasibilityDetail.find();
    res.status(200).json(feasibilityDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibility details", error: error.message });
  }
};

exports.getFeasibilityDetailById = async (req, res) => {
  try {
    const feasibilityDetail = await FeasibilityDetail.findById(req.params.id);
    if (!feasibilityDetail) {
      return res.status(404).json({ message: "Feasibility detail not found" });
    }
    res.status(200).json(feasibilityDetail);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feasibility detail", error: error.message });
  }
};

exports.updateFeasibilityDetail = async (req, res) => {
  try {
    const updatedFeasibilityDetail = await FeasibilityDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeasibilityDetail) {
      return res.status(404).json({ message: "Feasibility detail not found" });
    }
    res.status(200).json({ message: "Feasibility detail updated", data: updatedFeasibilityDetail });
  } catch (error) {
    res.status(500).json({ message: "Error updating feasibility detail", error: error.message });
  }
};

exports.deleteFeasibilityDetail = async (req, res) => {
  try {
    const deletedFeasibilityDetail = await FeasibilityDetail.findByIdAndDelete(req.params.id);
    if (!deletedFeasibilityDetail) {
      return res.status(404).json({ message: "Feasibility detail not found" });
    }
    res.status(200).json({ message: "Feasibility detail deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feasibility detail", error: error.message });
  }
};