// src/controllers/boxController.js

const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// --- ПОЛУЧИТЬ ВСЕ АКТИВНЫЕ БОКСЫ ---
exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await prisma.boxes.findMany({
      where: { is_active: true },
      orderBy: { box_number: "asc" },
    });
    res.status(200).json(boxes);
  } catch (error) {
    console.error("Get All Boxes Error:", error);
    res.status(500).json({ message: "Ошибка получения списка боксов." });
  }
};
