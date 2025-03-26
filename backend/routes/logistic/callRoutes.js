const express = require("express")
const { getCalls, createCall, completeCall, exportCalls } = require("../../controllers/logistic/callController")
const router = express.Router()

// Get all calls
router.get("/",getCalls)

// Create a new call
router.post("/",createCall)

// Mark a call as completed
router.put("/:id/complete",completeCall)

// Export calls to CSV
router.get("/export",exportCalls)

module.exports = router

