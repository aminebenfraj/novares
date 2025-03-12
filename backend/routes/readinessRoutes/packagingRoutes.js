const express = require("express");
const router = express.Router();
const {  getPackagingById, getAllPackagings, createPackaging, updatePackaging, deletePackaging } = require("../../controllers/readinessControllers/packagingController");

router.post("/", createPackaging);
router.get("/", getAllPackagings);
router.get("/:id", getPackagingById);
router.put("/:id", updatePackaging);
router.delete("/:id", deletePackaging);

module.exports = router;
