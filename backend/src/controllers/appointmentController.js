// src/controllers/appointmentController.js

const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const {
  addMinutes,
  format,
  parseISO,
  startOfDay,
  endOfDay,
  eachMinuteOfInterval,
} = require("date-fns");

// --- ДЛЯ КЛИЕНТА: ПОЛУЧИТЬ СПИСОК СВОИХ ЗАПИСЕЙ ---
exports.getMyBookings = async (req, res) => {
  const userId = req.user.userId;
  try {
    const bookings = await prisma.appointments.findMany({
      where: { client_id: userId },
      include: {
        cars: true,
        boxes: true,
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
    return res.status(400).json({
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
    const endTime = addMinutes(new Date(start_time), totalDuration);

    const newAppointment = await prisma.appointments.create({
      data: {
        client_id: userId,
        car_id: parseInt(car_id),
        start_time: new Date(start_time),
        end_time: endTime,
        status: "scheduled",
        total_price: totalPrice,
        notes,
        created_by: userId,
        appointment_services: {
          create: services.map((s) => ({
            service_id: s.service_id,
            price_at_time: s.price,
            quantity: 1,
          })),
        },
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Create Booking Error:", error);
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
      return res.status(400).json({
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

// --- ДЛЯ АДМИНА: ПОЛУЧИТЬ ВСЕ ЗАПИСИ ---
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.appointments.findMany({
      include: {
        users_appointments_client_idTousers: {
          select: { user_id: true, first_name: true, last_name: true },
        },
        cars: true,
        boxes: true,
        employees: {
          include: { users: { select: { first_name: true, last_name: true } } },
        },
        appointment_services: {
          include: {
            services: true,
          },
        },
      },
      orderBy: { start_time: "desc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ message: "Ошибка получения всех записей." });
  }
};

// ******** (ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ И ИСПРАВЛЕННАЯ ФУНКЦИЯ) ********
exports.getAvailableSlots = async (req, res) => {
  const { date, serviceIds } = req.query;

  // 1. Валидация входных данных
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !serviceIds) {
    return res
      .status(400)
      .json({
        message: "Необходимы параметры: date (YYYY-MM-DD) и serviceIds.",
      });
  }
  const ids = serviceIds
    .split(",")
    .map((id) => parseInt(id.trim()))
    .filter((id) => !isNaN(id));
  if (ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Необходим хотя бы один ID услуги." });
  }

  try {
    // 2. Сбор всей необходимой информации
    const requestedDate = parseISO(date);
    const dayOfWeek = requestedDate.getUTCDay();

    const [selectedServices, allBoxes, appointmentsOnDate] = await Promise.all([
      prisma.services.findMany({ where: { service_id: { in: ids } } }),
      prisma.boxes.findMany({ where: { is_active: true } }),
      prisma.appointments.findMany({
        where: {
          start_time: {
            gte: startOfDay(requestedDate),
            lt: endOfDay(requestedDate),
          },
          status: { notIn: ["cancelled"] },
        },
      }),
    ]);

    if (selectedServices.length !== ids.length)
      return res
        .status(404)
        .json({ message: "Одна или несколько услуг не найдены." });
    if (allBoxes.length === 0) return res.status(200).json([]);

    const totalDuration = selectedServices.reduce(
      (sum, s) => sum + s.duration_minutes,
      0
    );
    const requiredSpecIds = [
      ...new Set(
        selectedServices.map((s) => s.required_spec_id).filter(Boolean)
      ),
    ];

    const suitableMasters = await prisma.employees.findMany({
      where: {
        is_available: true,
        ...(requiredSpecIds.length > 0 && {
          employee_specializations: {
            some: { specialization_id: { in: requiredSpecIds } },
          },
        }),
        work_schedules: { some: { day_of_week: dayOfWeek, is_active: true } },
      },
      include: {
        work_schedules: { where: { day_of_week: dayOfWeek, is_active: true } },
      },
    });

    if (suitableMasters.length === 0) return res.status(200).json([]);

    // 3. Создание "таймлайнов занятости" для каждого ресурса
    const masterBusySlots = new Map();
    suitableMasters.forEach((m) => masterBusySlots.set(m.employee_id, []));
    appointmentsOnDate.forEach((app) => {
      if (app.master_id && masterBusySlots.has(app.master_id)) {
        masterBusySlots
          .get(app.master_id)
          .push({ start: app.start_time, end: app.end_time });
      }
    });

    // 4. Генерация и проверка потенциальных слотов
    const availableSlots = new Set();
    const SLOT_INTERVAL = 30;

    // Находим самое раннее начало и самое позднее окончание рабочего дня среди всех мастеров
    const earliestStart = new Date(
      Math.min(
        ...suitableMasters.flatMap((m) =>
          m.work_schedules.map((s) =>
            new Date(requestedDate).setUTCHours(
              s.start_time.getUTCHours(),
              s.start_time.getUTCMinutes()
            )
          )
        )
      )
    );
    const latestEnd = new Date(
      Math.max(
        ...suitableMasters.flatMap((m) =>
          m.work_schedules.map((s) =>
            new Date(requestedDate).setUTCHours(
              s.end_time.getUTCHours(),
              s.end_time.getUTCMinutes()
            )
          )
        )
      )
    );

    if (isNaN(earliestStart.getTime()) || isNaN(latestEnd.getTime()))
      return res.status(200).json([]);

    const potentialStartTimes = eachMinuteOfInterval(
      { start: earliestStart, end: addMinutes(latestEnd, -totalDuration) },
      { step: SLOT_INTERVAL }
    );

    for (const slotStart of potentialStartTimes) {
      const slotEnd = addMinutes(slotStart, totalDuration);

      // 4.1. Проверка доступности мастера
      let isMasterAvailable = false;
      for (const master of suitableMasters) {
        // Мастер должен работать в этот временной интервал
        const schedule = master.work_schedules[0];
        const workStart = new Date(requestedDate).setUTCHours(
          schedule.start_time.getUTCHours(),
          schedule.start_time.getUTCMinutes(),
          0,
          0
        );
        const workEnd = new Date(requestedDate).setUTCHours(
          schedule.end_time.getUTCHours(),
          schedule.end_time.getUTCMinutes(),
          0,
          0
        );

        if (slotStart >= workStart && slotEnd <= workEnd) {
          // И мастер не должен быть занят в это время
          const busySlots = masterBusySlots.get(master.employee_id);
          const isBusy = busySlots.some(
            (busy) => slotStart < busy.end && slotEnd > busy.start
          );
          if (!isBusy) {
            isMasterAvailable = true;
            break; // Нашли свободного мастера, дальше можно не искать
          }
        }
      }
      if (!isMasterAvailable) continue; // Если ни один мастер не свободен, пропускаем слот

      // 4.2. Проверка доступности бокса
      const overlappingAppointments = appointmentsOnDate.filter(
        (app) => slotStart < app.end_time && slotEnd > app.start_time
      );
      const busyBoxCounts = new Map();
      overlappingAppointments.forEach((app) => {
        if (app.box_id) {
          busyBoxCounts.set(
            app.box_id,
            (busyBoxCounts.get(app.box_id) || 0) + 1
          );
        }
      });
      const isBoxAvailable = allBoxes.some(
        (box) => (busyBoxCounts.get(box.box_id) || 0) < box.capacity
      );
      if (!isBoxAvailable) continue; // Если нет свободных боксов, пропускаем слот

      // Если все проверки пройдены, добавляем слот
      availableSlots.add(format(slotStart, "HH:mm"));
    }

    res.status(200).json(Array.from(availableSlots).sort());
  } catch (error) {
    console.error("Get Available Slots Error:", error);
    res.status(500).json({ message: "Ошибка при поиске свободных слотов." });
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
  try {
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
        boxes: true,
        appointment_services: { include: { services: true } },
        users_appointments_client_idTousers: {
          select: { first_name: true, last_name: true, phone_number: true },
        },
      },
      orderBy: { start_time: "asc" },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get My Tasks Error:", error);
    res.status(500).json({ message: "Ошибка получения задач." });
  }
};

// --- АДМИНСКИЕ ФУНКЦИИ ---
exports.createBookingByAdmin = async (req, res) => {
  res.status(501).json({
    message: "Создание записи от имени администратора еще не реализовано.",
  });
};

exports.updateBookingByAdmin = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { master_id, box_id } = req.body;

  if (master_id === undefined || box_id === undefined) {
    return res
      .status(400)
      .json({ message: "Необходимо передать ID мастера и бокса." });
  }

  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Запись не найдена." });
    }

    const updatedAppointment = await prisma.appointments.update({
      where: { appointment_id: appointmentId },
      data: {
        master_id: master_id ? parseInt(master_id) : null,
        box_id: box_id ? parseInt(box_id) : null,
        updated_at: new Date(),
      },
      include: {
        boxes: true,
        employees: {
          include: { users: { select: { first_name: true, last_name: true } } },
        },
      },
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Update Booking By Admin Error:", error);
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ message: "Указанный мастер или бокс не существует." });
    }
    res.status(500).json({ message: "Ошибка при обновлении записи." });
  }
};
