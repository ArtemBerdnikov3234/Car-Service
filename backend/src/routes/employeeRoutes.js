// src/routes/employeeRoutes.js
const express = require("express");
const employeeController = require("../controllers/employeeController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect, isAdmin);

router.get("/", employeeController.getAllEmployees);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);

module.exports = router;
