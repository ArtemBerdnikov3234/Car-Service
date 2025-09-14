const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// ====================================================================
// --- ПУБЛИЧНЫЙ МАРШРУТ (должен быть до router.use(protect)) ---
// ====================================================================
// Этот роут не требует аутентификации, чтобы любой мог видеть свободное время
router.get("/available-slots", appointmentController.getAvailableSlots);

// ====================================================================
// --- ЗАЩИЩЕННЫЕ МАРШРУТЫ (для авторизованных пользователей) ---
// ====================================================================
router.use(protect); // Все, что ниже, требует токен

// Маршруты для КЛИЕНТА
router.get("/my", appointmentController.getMyBookings);
router.post("/", appointmentController.createBooking);

// Маршруты для МАСТЕРА
router.get("/tasks", appointmentController.getMyTasks);

// Маршруты для АДМИНИСТРАТОРА
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

// ОБЩИЕ защищенные маршруты
router.put("/:id/cancel", appointmentController.cancelBooking);
router.put("/:id/status", appointmentController.updateBookingStatus);

module.exports = router;
