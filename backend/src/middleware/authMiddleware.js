const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Нет авторизации, токен недействителен" });
    }
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Нет авторизации, токен отсутствует" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Доступ запрещен. Требуются права администратора." });
  }
};
