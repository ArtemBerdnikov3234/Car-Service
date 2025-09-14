const express = require("express");
const serviceController = require("../controllers/serviceController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

router.post("/", protect, isAdmin, serviceController.createService);
router.put("/:id", protect, isAdmin, serviceController.updateService);
router.delete("/:id", protect, isAdmin, serviceController.deactivateService);

module.exports = router;
