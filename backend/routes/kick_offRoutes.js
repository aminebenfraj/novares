const express = require("express");
const { createKickOff, getAllKickOffs, getKickOffById, updateKickOff, deleteKickOff } = require("../controllers/kick_offController");
const router = express.Router();


// ✅ Create a new Kick-Off with associated tasks
router.post("/", createKickOff);

// ✅ Get all Kick-Offs with their tasks
router.get("/", getAllKickOffs);

// ✅ Get a specific Kick-Off by ID
router.get("/:id", getKickOffById);

// ✅ Update a Kick-Off and its tasks
router.put("/:id", updateKickOff);

// ✅ Delete a Kick-Off and its associated tasks
router.delete("/:id", deleteKickOff);

module.exports = router;
