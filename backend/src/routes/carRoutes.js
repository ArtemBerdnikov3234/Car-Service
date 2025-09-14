const express = require("express");
const carController = require("../controllers/carController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/", carController.getMyCars);
router.post("/", carController.createCar);
router.put("/:carId", carController.updateCar);
router.delete("/:carId", carController.deleteCar);

module.exports = router;
