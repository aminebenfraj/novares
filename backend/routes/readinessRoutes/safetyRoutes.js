const express = require("express");
const router = express.Router();
const { createSafety, getSafetyById, updateSafety, deleteSafety, getAllSafeties } = require("../../controllers/readinessControllers/safetyController");

router.post("/", createSafety);
router.get("/", getAllSafeties);
router.get("/:id", getSafetyById);
router.put("/:id", updateSafety);
router.delete("/:id", deleteSafety);

module.exports = router;
