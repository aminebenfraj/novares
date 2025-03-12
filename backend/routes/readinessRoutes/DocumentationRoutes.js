const express = require("express");
const router = express.Router();
const { createDocumentation, getDocumentationById, updateDocumentation, deleteDocumentation, getAllDocumentations } = require("../../controllers/readinessControllers/documentation");

router.post("/", createDocumentation);
router.get("/", getAllDocumentations);
router.get("/:id", getDocumentationById);
router.put("/:id", updateDocumentation);
router.delete("/:id", deleteDocumentation);

module.exports = router;
