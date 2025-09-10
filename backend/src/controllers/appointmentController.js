// src/controllers/appointmentController.js
const { PrismaClient, Prisma } = require("../../generated/prisma");
const prisma = new PrismaClient();

// --- ДЛЯ КЛИЕНТА: ПОЛУЧИТЬ СПИСОК СВОИХ ЗАПИСЕЙ (АКТИВНЫХ И ПРОШЕДШИХ) ---
exports.getMyBookings = async (req, res) => {
  const userId = req.user.userId;
  try {
    const bookings = await prisma.appointments.findMany({
      where: { client_id: userId },
      include: {
        cars: true,
        appointment_services: {
          include: {
            services: true,
          },
        },
        employees: {
          include: {
            users: {
              select: { first_name: true, last_name: true },
            },
          },
        },
      },
      orderBy: { start_time: "desc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ message: "Ошибка получения ваших записей." });
  }
};

// --- ДЛЯ КЛИЕНТА: СОЗДАТЬ НОВУЮ ЗАПИСЬ ---
exports.createBooking = async (req, res) => {
  const userId = req.user.userId;
  const { car_id, service_ids, start_time, notes } = req.body;

  if (!car_id || !service_ids || !service_ids.length || !start_time) {
    return res
      .status(400)
      .json({
        message: "Необходимо указать автомобиль, услуги и время записи.",
      });
  }

  try {
    const car = await prisma.cars.findFirst({
      where: { car_id: parseInt(car_id), owner_id: userId },
    });
    if (!car) {
      return res
        .status(403)
        .json({ message: "Вы не можете записать этот автомобиль." });
    }

    const services = await prisma.services.findMany({
      where: { service_id: { in: service_ids.map((id) => parseInt(id)) } },
    });
    if (services.length !== service_ids.length) {
      return res
        .status(404)
        .json({ message: "Одна или несколько выбранных услуг не найдены." });
    }

    const totalDuration = services.reduce(
      (sum, s) => sum + s.duration_minutes,
      0
    );
    const totalPrice = services.reduce(
      (sum, s) => sum + parseFloat(s.price),
      0
    );
    const endTime = new Date(
      new Date(start_time).getTime() + totalDuration * 60000
    );

    const newAppointment = await prisma.appointments.create({
      data: {
        client_id: userId,
        car_id: parseInt(car_id),
        start_time: new Date(start_time),
        end_time: endTime,
        total_price: totalPrice,
        notes,
        created_by: userId,
        appointment_services: {
          create: services.map((s) => ({
            service_id: s.service_id,
            price_at_time: s.price,
          })),
        },
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Create Booking Error:", error);
    // Ловим ошибку от EXCLUDE constraint (конфликт расписания)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.message.includes("violates exclusion constraint")
    ) {
      return res
        .status(409)
        .json({
          message: "Выбранное время уже занято. Пожалуйста, выберите другое.",
        });
    }
    res.status(500).json({ message: "Не удалось создать запись." });
  }
};

// --- ДЛЯ КЛИЕНТА И АДМИНА: ОТМЕНА ЗАПИСИ ---
exports.cancelBooking = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { userId, role } = req.user;

  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: appointmentId },
    });
    if (!appointment) {
      return res.status(404).json({ message: "Запись не найдена." });
    }

    if (role === "client" && appointment.client_id !== userId) {
      return res
        .status(403)
        .json({ message: "Вы не можете отменить чужую запись." });
    }

    if (["in_progress", "completed"].includes(appointment.status)) {
      return res
        .status(400)
        .json({
          message: "Невозможно отменить уже начатую или завершенную работу.",
        });
    }

    const cancelledAppointment = await prisma.appointments.update({
      where: { appointment_id: appointmentId },
      data: { status: "cancelled" },
    });

    res.status(200).json(cancelledAppointment);
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Ошибка при отмене записи." });
  }
};

// --- ДЛЯ АДМИНА: ПОЛУЧИТЬ ВСЕ ЗАПИСИ (ДЛЯ КАЛЕНДАРЯ) ---
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.appointments.findMany({
      where: { status: { not: "cancelled" } },
      include: {
        users_appointments_client_idTousers: {
          select: { first_name: true, last_name: true },
        },
        cars: true,
        employees: {
          include: { users: { select: { first_name: true, last_name: true } } },
        },
      },
      orderBy: { start_time: "asc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ message: "Ошибка получения всех записей." });
  }
};

// --- ДЛЯ МАСТЕРА И АДМИНА: ИЗМЕНИТЬ СТАТУС ЗАПИСИ ---
exports.updateBookingStatus = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { status } = req.body;
  const { userId, role } = req.user;

  if (
    !status ||
    !["scheduled", "in_progress", "completed", "cancelled"].includes(status)
  ) {
    return res.status(400).json({ message: "Некорректный статус." });
  }

  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: appointmentId },
    });
    if (!appointment) {
      return res.status(404).json({ message: "Запись не найдена." });
    }

    if (role === "master") {
      const employee = await prisma.employees.findUnique({
        where: { user_id: userId },
      });
      if (!employee || appointment.master_id !== employee.employee_id) {
        return res.status(403).json({ message: "Это не ваша работа." });
      }
    }

    const updated = await prisma.appointments.update({
      where: { appointment_id: appointmentId },
      data: { status },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({ message: "Ошибка обновления статуса." });
  }
};

// --- ДЛЯ МАСТЕРА: ПОЛУЧИТЬ СВОИ ЗАДАЧИ ---
exports.getMyTasks = async (req, res) => {
  const employee = await prisma.employees.findUnique({
    where: { user_id: req.user.userId },
  });
  if (!employee) {
    return res.status(404).json({ message: "Профиль сотрудника не найден." });
  }
  const tasks = await prisma.appointments.findMany({
    where: {
      master_id: employee.employee_id,
      status: { notIn: ["completed", "cancelled"] },
    },
    include: {
      cars: true,
      users_appointments_client_idTousers: {
        select: { first_name: true, last_name: true, phone_number: true },
      },
    },
    orderBy: { start_time: "asc" },
  });
  res.status(200).json(tasks);
};

// --- ЗАГЛУШКИ ДЛЯ СЛОЖНОЙ АДМИНСКОЙ ЛОГИКИ ---
exports.createBookingByAdmin = async (req, res) => {
  res
    .status(501)
    .json({
      message: "Создание записи от имени администратора еще не реализовано.",
    });
};
exports.updateBookingByAdmin = async (req, res) => {
  res
    .status(501)
    .json({
      message: "Редактирование записи администратором еще не реализовано.",
    });
};
