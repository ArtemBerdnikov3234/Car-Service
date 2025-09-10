// src/routes/scheduleRoutes.js
const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect, isAdmin);

router.get("/employee/:employeeId", scheduleController.getScheduleForEmployee);
router.post("/", scheduleController.addScheduleEntry);
router.delete("/:scheduleId", scheduleController.deleteScheduleEntry);

module.exports = router;
