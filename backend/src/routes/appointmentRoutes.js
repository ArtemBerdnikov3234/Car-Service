// src/routes/appointmentRoutes.js
const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

// Маршруты для КЛИЕНТА
router.get("/my", appointmentController.getMyBookings);
router.post("/", appointmentController.createBooking);

// Маршруты для МАСТЕРА
router.get("/tasks", appointmentController.getMyTasks);

// Маршруты для АДМИНИСТРАТОРА
router.get("/", isAdmin, appointmentController.getAllBookings);
// Заглушки для сложной логики, которую нужно будет дописать
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

// ОБЩИЕ маршруты
router.put("/:id/cancel", appointmentController.cancelBooking);
router.put("/:id/status", appointmentController.updateBookingStatus);

module.exports = router;
