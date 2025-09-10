// src/controllers/carController.js
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getMyCars = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cars = await prisma.cars.findMany({
      where: { owner_id: userId },
      orderBy: { make: "asc" },
    });
    res.status(200).json(cars);
  } catch (error) {
    console.error("Get My Cars Error:", error);
    res.status(500).json({ message: "Ошибка получения списка автомобилей" });
  }
};

exports.createCar = async (req, res) => {
  const userId = req.user.userId;
  const {
    make,
    model,
    year_of_manufacture,
    vin_code,
    license_plate,
    mileage,
    notes,
  } = req.body;
  if (!make || !model || !year_of_manufacture) {
    return res
      .status(400)
      .json({
        message:
          "Поля 'Марка', 'Модель' и 'Год выпуска' обязательны для заполнения.",
      });
  }
  try {
    const newCar = await prisma.cars.create({
      data: {
        owner_id: userId,
        make,
        model,
        year_of_manufacture: parseInt(year_of_manufacture),
        vin_code,
        license_plate,
        mileage: mileage ? parseInt(mileage) : null,
        notes,
      },
    });
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Create Car Error:", error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          message: "Автомобиль с таким VIN или гос. номером уже существует.",
        });
    }
    if (error.code === "P2000") {
      return res
        .status(400)
        .json({
          message:
            "Значение для одного из полей слишком длинное (например, VIN).",
        });
    }
    res.status(500).json({ message: "Ошибка при добавлении автомобиля." });
  }
};

exports.updateCar = async (req, res) => {
  const userId = req.user.userId;
  const carId = parseInt(req.params.carId);
  const {
    make,
    model,
    year_of_manufacture,
    vin_code,
    license_plate,
    mileage,
    notes,
  } = req.body;
  try {
    const car = await prisma.cars.findUnique({ where: { car_id: carId } });
    if (!car) {
      return res.status(404).json({ message: "Автомобиль не найден." });
    }
    if (car.owner_id !== userId) {
      return res
        .status(403)
        .json({ message: "Доступ запрещен. Это не ваш автомобиль." });
    }

    const updatedCar = await prisma.cars.update({
      where: { car_id: carId },
      data: {
        make,
        model,
        year_of_manufacture: parseInt(year_of_manufacture),
        vin_code,
        license_plate,
        mileage: mileage ? parseInt(mileage) : null,
        notes,
      },
    });
    res.status(200).json(updatedCar);
  } catch (error) {
    console.error("Update Car Error:", error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          message: "Автомобиль с таким VIN или гос. номером уже существует.",
        });
    }
    res
      .status(500)
      .json({ message: "Ошибка при обновлении информации об автомобиле." });
  }
};

exports.deleteCar = async (req, res) => {
  const userId = req.user.userId;
  const carId = parseInt(req.params.carId);
  try {
    const car = await prisma.cars.findFirst({
      where: { car_id: carId, owner_id: userId },
    });
    if (!car) {
      return res
        .status(404)
        .json({
          message: "Автомобиль не найден или у вас нет прав на его удаление.",
        });
    }

    await prisma.cars.delete({ where: { car_id: carId } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete Car Error:", error);
    if (error.code === "P2003") {
      return res
        .status(409)
        .json({
          message:
            "Невозможно удалить автомобиль, так как он используется в записях на сервис.",
        });
    }
    res.status(500).json({ message: "Ошибка при удалении автомобиля." });
  }
};
