const express = require("express");
const router = express.Router();
const { createToolingStatus, getAllToolingStatuses, getToolingStatusById, updateToolingStatus, deleteToolingStatus } = require("../../controllers/readinessControllers/toolingStatusController");

router.post("/", createToolingStatus);
router.get("/", getAllToolingStatuses);
router.get("/:id", getToolingStatusById);
router.put("/:id", updateToolingStatus);
router.delete("/:id", deleteToolingStatus);

module.exports = router;
