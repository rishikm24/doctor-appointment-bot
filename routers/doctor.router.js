const express = require("express");
const router = express.Router({ mergeParams: true });

const doctorCtrl = require('../src/apis/doctor/doctor.ctrl')

// Define API routes
router.post("/slots", doctorCtrl.addSlots);
router.delete("/slot/:id", doctorCtrl.removeSlot)

module.exports = router;