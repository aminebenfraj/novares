const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // ✅ Middleware for file uploads

// ✅ Corrected import statement (removed extra space)
const { 
  createValidationForOffer, 
  getAllValidationForOffers, 
  getValidationForOfferById, 
  updateValidationForOffer, 
  deleteValidationForOffer 
} = require("../controllers/validationForOfferController"); 

// ✅ Create a new ValidationForOffer entry
router.post("/", upload.single("upload"), createValidationForOffer);

// ✅ Get all ValidationForOffer entries
router.get("/", getAllValidationForOffers);

// ✅ Get a single ValidationForOffer entry by ID
router.get("/:id", getValidationForOfferById);

// ✅ Update ValidationForOffer entry
router.put("/:id", upload.single("upload"), updateValidationForOffer);

// ✅ Delete a ValidationForOffer entry
router.delete("/:id", deleteValidationForOffer);

module.exports = router;
