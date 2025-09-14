const { PrismaClient } = require("../../generated/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните все обязательные поля." });
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { email_lower: email.toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,

        password_hash: hashedPassword,
        phone_number,
        role: "client",
      },
    });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован.",
      userId: user.user_id,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Внутренняя ошибка сервера при регистрации." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, введите email и пароль." });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email_lower: email.toLowerCase() },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "Неверные учетные данные или пользователь неактивен.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Неверные учетные данные." });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера при входе." });
  }
};
