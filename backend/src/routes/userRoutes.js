const express = require("express");
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/me", userController.getMyProfile);
router.put("/me", userController.updateMyProfile);

router.get("/clients", isAdmin, userController.getAllClients);

module.exports = router;
