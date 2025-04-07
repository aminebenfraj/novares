"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/pedidoController/tableStatusController"),
  getAllTableStatuses = _require.getAllTableStatuses,
  getTableStatusById = _require.getTableStatusById,
  createTableStatus = _require.createTableStatus,
  updateTableStatus = _require.updateTableStatus,
  reorderTableStatuses = _require.reorderTableStatuses,
  deleteTableStatus = _require.deleteTableStatus;

// GET all table statuses
router.get("/", getAllTableStatuses);

// GET a single table status by ID
router.get("/:id", getTableStatusById);

// POST a new table status
router.post("/", createTableStatus);

// PUT (update) a table status
router.put("/:id", updateTableStatus);

// DELETE a table status
router["delete"]("/:id", deleteTableStatus);

// POST to reorder table statuses
router.post("/reorder", reorderTableStatuses);
module.exports = router;