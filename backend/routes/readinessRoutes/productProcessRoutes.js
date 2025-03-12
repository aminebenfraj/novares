const express = require("express");
const router = express.Router();
const { createProductProcess, getAllProductProcesses, getProductProcessById, updateProductProcess, deleteProductProcess } = require("../../controllers/readinessControllers/productProcessController");

router.post("/", createProductProcess);
router.get("/", getAllProductProcesses);
router.get("/:id", getProductProcessById);
router.put("/:id", updateProductProcess);
router.delete("/:id", deleteProductProcess);

module.exports = router;
