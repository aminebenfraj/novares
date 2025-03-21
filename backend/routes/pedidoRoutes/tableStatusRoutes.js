const express = require("express")
const router = express.Router()
const tableStatusController = require("../controllers/tableStatusController")

// GET all table statuses
router.get("/", tableStatusController.getAllTableStatuses)

// GET a single table status by ID
router.get("/:id", tableStatusController.getTableStatusById)

// POST a new table status
router.post("/", tableStatusController.createTableStatus)

// PUT (update) a table status
router.put("/:id", tableStatusController.updateTableStatus)

// DELETE a table status
router.delete("/:id", tableStatusController.deleteTableStatus)

// POST to reorder table statuses
router.post("/reorder", tableStatusController.reorderTableStatuses)

module.exports = router

