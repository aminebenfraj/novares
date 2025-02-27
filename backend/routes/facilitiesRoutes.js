const express = require("express");
const router = express.Router();
const { createFacilities, getAllFacilities, getFacilitiesById, updateFacilities, deleteFacilities } = require("../controllers/facilitiesController");

router.post("/", createFacilities);
router.get("/", getAllFacilities);
router.get("/:id", getFacilitiesById);
router.put("/:id", updateFacilities);
router.delete("/:id", deleteFacilities);

module.exports = router;
