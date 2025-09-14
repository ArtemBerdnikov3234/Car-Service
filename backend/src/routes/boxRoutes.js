// src/routes/boxRoutes.js

const express = require("express");
const boxController = require("../controllers/boxController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Все маршруты защищены и доступны только администратору
router.use(protect, isAdmin);

router.get("/", boxController.getAllBoxes);

module.exports = router;
