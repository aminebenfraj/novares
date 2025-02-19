const express = require("express");
const router = express.Router();
const {
  createCheckin,
  getAllCheckins,
  getCheckinById,
  updateCheckin,
  deleteCheckin
} = require("../controllers/checkinController");

router.post("/", createCheckin);
router.get("/", getAllCheckins);
router.get("/:id", getCheckinById);
router.put("/:id", updateCheckin);
router.delete("/:id", deleteCheckin);

module.exports = router;
