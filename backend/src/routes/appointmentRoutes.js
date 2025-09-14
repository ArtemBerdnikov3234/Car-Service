const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/available-slots", appointmentController.getAvailableSlots);

router.use(protect);

router.get("/my", appointmentController.getMyBookings);
router.post("/", appointmentController.createBooking);

router.get("/tasks", appointmentController.getMyTasks);

router.get("/", isAdmin, appointmentController.getAllBookings);
router.post(
  "/admin-booking",
  isAdmin,
  appointmentController.createBookingByAdmin
);
router.put(
  "/:id/admin-update",
  isAdmin,
  appointmentController.updateBookingByAdmin
);

router.put("/:id/cancel", appointmentController.cancelBooking);
router.put("/:id/status", appointmentController.updateBookingStatus);

module.exports = router;
