"use strict";

var express = require("express");
var router = express.Router();
var upload = require("../middlewares/uploadMiddleware"); // ✅ Middleware for file uploads

// ✅ Corrected import statement (removed extra space)
var _require = require("../controllers/validationForOfferController"),
  createValidationForOffer = _require.createValidationForOffer,
  getAllValidationForOffers = _require.getAllValidationForOffers,
  getValidationForOfferById = _require.getValidationForOfferById,
  updateValidationForOffer = _require.updateValidationForOffer,
  deleteValidationForOffer = _require.deleteValidationForOffer;

// ✅ Create a new ValidationForOffer entry
router.post("/", upload.single("upload"), createValidationForOffer);

// ✅ Get all ValidationForOffer entries
router.get("/", getAllValidationForOffers);

// ✅ Get a single ValidationForOffer entry by ID
router.get("/:id", getValidationForOfferById);

// ✅ Update ValidationForOffer entry
router.put("/:id", upload.single("upload"), updateValidationForOffer);

// ✅ Delete a ValidationForOffer entry
router["delete"]("/:id", deleteValidationForOffer);
module.exports = router;