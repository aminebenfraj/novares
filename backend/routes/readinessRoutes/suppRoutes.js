const express = require("express");
const router = express.Router();
const { createSupp, getAllSupps, getSuppById, updateSupp, deleteSupp } = require("../../controllers/readinessControllers/suppController");

router.post("/", createSupp);
router.get("/", getAllSupps);
router.get("/:id", getSuppById);
router.put("/:id", updateSupp);
router.delete("/:id", deleteSupp);

module.exports = router;
