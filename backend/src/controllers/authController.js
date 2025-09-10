// src/controllers/authController.js
const { PrismaClient } = require("../../generated/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

/**
 * Регистрация нового пользователя (только с ролью 'client')
 */
exports.register = async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  // 1. Валидация входных данных
  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните все обязательные поля." });
  }

  try {
    // 2. Проверка, существует ли уже пользователь с таким email
    const existingUser = await prisma.users.findUnique({
      where: { email_lower: email.toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует." });
    }

    // 3. Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Создание пользователя в базе данных
    const user = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        // Поле email_lower заполняется автоматически триггером в БД
        password_hash: hashedPassword,
        phone_number,
        role: "client", // Новые регистрации всегда получают роль клиента
      },
    });

    // 5. Отправка успешного ответа
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

/**
 * Аутентификация пользователя и выдача JWT токена
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Валидация входных данных
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, введите email и пароль." });
  }

  try {
    // 2. Поиск пользователя в базе данных по email (без учета регистра)
    const user = await prisma.users.findUnique({
      where: { email_lower: email.toLowerCase() },
    });

    // 3. Проверка, найден ли пользователь и активен ли его аккаунт
    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "Неверные учетные данные или пользователь неактивен.",
      });
    }

    // 4. Сравнение введенного пароля с хешем в базе данных
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    // 5. Если пароли не совпадают, возвращаем ошибку
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Неверные учетные данные." });
    }

    // 6. Если все проверки пройдены, создаем JWT токен
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // Данные, которые "зашиваются" в токен
      process.env.JWT_SECRET, // Секретный ключ из .env
      { expiresIn: "24h" } // Время жизни токена
    );

    // 7. Отправляем токен и информацию о пользователе на клиент
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
