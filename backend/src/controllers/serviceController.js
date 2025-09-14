const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.services.findMany({
      where: { is_active: true },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения услуг." });
  }
};

exports.getServiceById = async (req, res) => {
  const serviceId = parseInt(req.params.id);
  try {
    const service = await prisma.services.findUnique({
      where: { service_id: serviceId },
    });
    if (!service) {
      return res.status(404).json({ message: "Услуга не найдена." });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения данных об услуге." });
  }
};

exports.createService = async (req, res) => {
  const { name, description, price, duration_minutes, required_spec_id } =
    req.body;
  try {
    const service = await prisma.services.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration_minutes),
        required_spec_id: required_spec_id ? parseInt(required_spec_id) : null,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Ошибка создания услуги." });
  }
};

exports.updateService = async (req, res) => {
  const serviceId = parseInt(req.params.id);
  const {
    name,
    description,
    price,
    duration_minutes,
    required_spec_id,
    is_active,
  } = req.body;
  try {
    const updatedService = await prisma.services.update({
      where: { service_id: serviceId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        duration_minutes: duration_minutes
          ? parseInt(duration_minutes)
          : undefined,
        required_spec_id: required_spec_id
          ? parseInt(required_spec_id)
          : undefined,
        is_active,
      },
    });
    res.status(200).json(updatedService);
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Услуга для обновления не найдена." });
    }
    res.status(500).json({ message: "Ошибка при обновлении услуги." });
  }
};

exports.deactivateService = async (req, res) => {
  const serviceId = parseInt(req.params.id);
  try {
    await prisma.services.update({
      where: { service_id: serviceId },
      data: { is_active: false },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Услуга для деактивации не найдена." });
    }
    res.status(500).json({ message: "Ошибка при деактивации услуги." });
  }
};
