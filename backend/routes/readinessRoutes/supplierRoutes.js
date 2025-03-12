const express = require("express");
const router = express.Router();
const { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require("../../controllers/readinessControllers/supplierController");

router.post("/", createSupplier);
router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
