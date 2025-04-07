"use strict";

var express = require("express");
var _require = require("../../controllers/logistic/callController"),
  getCalls = _require.getCalls,
  createCall = _require.createCall,
  completeCall = _require.completeCall,
  exportCalls = _require.exportCalls,
  checkExpiredCalls = _require.checkExpiredCalls;
var router = express.Router();

// Get all calls
router.get("/", getCalls);

// Create a new call
router.post("/", createCall);

// Mark a call as completed
router.put("/:id/complete", completeCall);

// Export calls to CSV
router.get("/export", exportCalls);

// Manually check and update expired calls
router.post("/check-expired", checkExpiredCalls);
module.exports = router;