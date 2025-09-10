// src/routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect); // Все маршруты ниже требуют авторизации

// Клиентские маршруты для своего профиля
router.get("/me", userController.getMyProfile);
router.put("/me", userController.updateMyProfile);

// Админские маршруты
router.get("/clients", isAdmin, userController.getAllClients);

module.exports = router;
