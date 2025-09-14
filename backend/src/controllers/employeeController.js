const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            role: true,
            is_active: true,
          },
        },
      },
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения списка сотрудников." });
  }
};

exports.createEmployee = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    role,
    hire_date,
  } = req.body;
  if (
    !first_name ||
    !email ||
    !password ||
    !role ||
    !["admin", "master"].includes(role)
  ) {
    return res.status(400).json({
      message:
        "Имя, email, пароль и корректная роль ('admin' или 'master') обязательны.",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newEmployee = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password_hash: hashedPassword,
        phone_number,
        role,
        employees: {
          create: { hire_date: hire_date ? new Date(hire_date) : new Date() },
        },
      },
      include: { employees: true },
    });
    delete newEmployee.password_hash;
    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Пользователь с таким email или телефоном уже существует.",
      });
    }
    res.status(500).json({ message: "Ошибка при создании сотрудника." });
  }
};

exports.updateEmployee = async (req, res) => {
  const employeeId = parseInt(req.params.id);
  const {
    first_name,
    last_name,
    email,
    phone_number,
    is_active,
    is_available,
  } = req.body;
  try {
    const employee = await prisma.employees.findUnique({
      where: { employee_id: employeeId },
    });
    if (!employee) {
      return res.status(404).json({ message: "Сотрудник не найден." });
    }
    const updatedUser = await prisma.users.update({
      where: { user_id: employee.user_id },
      data: { first_name, last_name, email, phone_number, is_active },
    });
    await prisma.employees.update({
      where: { employee_id: employeeId },
      data: { is_available },
    });
    delete updatedUser.password_hash;
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении данных сотрудника." });
  }
};
