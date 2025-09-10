// src/app.js
const express = require("express");
const cors = require("cors");

// Импортируем все наши роутеры
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const carRoutes = require("./routes/carRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

// Подключаем middleware
app.use(cors());
app.use(express.json());

// Тестовый корневой маршрут
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to AutoService API!" });
});

// Подключаем все API роуты
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);

// Обработчик для несуществующих маршрутов
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
