const express = require("express");
const router = express.Router();
const { createDocumentation, getAllDocumentation, getDocumentationById, updateDocumentation, deleteDocumentation } = require("../../controllers/readinessControllers/documentation");

router.post("/", createDocumentation);
router.get("/", getAllDocumentation);
router.get("/:id", getDocumentationById);
router.put("/:id", updateDocumentation);
router.delete("/:id", deleteDocumentation);

module.exports = router;
