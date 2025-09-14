const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getMyProfile = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { user_id: req.user.userId },
    select: {
      first_name: true,
      last_name: true,
      email: true,
      phone_number: true,
    },
  });
  res.status(200).json(user);
};

exports.updateMyProfile = async (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  const updatedUser = await prisma.users.update({
    where: { user_id: req.user.userId },
    data: { first_name, last_name, phone_number },
  });
  delete updatedUser.password_hash;
  res.status(200).json(updatedUser);
};

exports.getAllClients = async (req, res) => {
  const clients = await prisma.users.findMany({
    where: { role: "client" },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone_number: true,
      is_active: true,
    },
  });
  res.status(200).json(clients);
};
