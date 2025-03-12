const express = require("express");
const router = express.Router();
const { createValidation, getAllValidations, getValidationById, updateValidation, deleteValidation } = require("../../controllers/readinessControllers/validationController");

router.post("/", createValidation);
router.get("/", getAllValidations);
router.get("/:id", getValidationById);
router.put("/:id", updateValidation);
router.delete("/:id", deleteValidation);

module.exports = router;