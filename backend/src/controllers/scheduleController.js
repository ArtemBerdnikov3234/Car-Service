const { PrismaClient, Prisma } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getScheduleForEmployee = async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);
  try {
    const schedule = await prisma.work_schedules.findMany({
      where: {
        employee_id: employeeId,
        is_active: true,
      },
      orderBy: {
        day_of_week: "asc",
      },
    });
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Get Schedule Error:", error);
    res.status(500).json({ message: "Ошибка получения графика работы." });
  }
};

exports.addScheduleEntry = async (req, res) => {
  const { employee_id, day_of_week, start_time, end_time } = req.body;

  if (!employee_id || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({
      message:
        "Все поля (employee_id, day_of_week, start_time, end_time) обязательны.",
    });
  }

  try {
    const employee = await prisma.employees.findUnique({
      where: { employee_id: parseInt(employee_id) },
    });
    if (!employee) {
      return res.status(404).json({ message: "Сотрудник не найден." });
    }

    const startTimeISO = new Date(`${baseDate}T${start_time}Z`);
    const endTimeISO = new Date(`${baseDate}T${end_time}Z`);

    if (isNaN(startTimeISO.getTime()) || isNaN(endTimeISO.getTime())) {
      return res.status(400).json({
        message: "Некорректный формат времени. Ожидается 'HH:MM:SS'.",
      });
    }

    const newEntry = await prisma.work_schedules.create({
      data: {
        employee_id: parseInt(employee_id),
        day_of_week: parseInt(day_of_week),
        start_time: startTimeISO,
        end_time: endTimeISO,
        is_active: true,
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Add Schedule Entry Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Такой временной слот для этого сотрудника уже существует.",
      });
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res
        .status(400)
        .json({ message: "Ошибка формата данных. Проверьте все поля." });
    }
    res.status(500).json({ message: "Ошибка добавления записи в график." });
  }
};

exports.deleteScheduleEntry = async (req, res) => {
  const scheduleId = parseInt(req.params.scheduleId);

  try {
    await prisma.work_schedules.delete({
      where: {
        schedule_id: scheduleId,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Delete Schedule Entry Error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Запись в графике не найдена." });
    }
    res.status(500).json({ message: "Ошибка удаления записи из графика." });
  }
};
