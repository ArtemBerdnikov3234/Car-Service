// src/routes/serviceRoutes.js
const express = require("express");
const serviceController = require("../controllers/serviceController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Публичные маршруты
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Маршруты только для администраторов
router.post("/", protect, isAdmin, serviceController.createService);
router.put("/:id", protect, isAdmin, serviceController.updateService);
router.delete("/:id", protect, isAdmin, serviceController.deactivateService);

module.exports = router;
