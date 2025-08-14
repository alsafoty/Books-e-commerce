const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const roleCheck = async (req, res, next) => {
  if (!req.user.userId) {
    return res.status(401).json({ error: "User Id is required" });
  }
  const userId = req.user.userId; // Assuming user ID is stored in req.user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the user has the required role
  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};

module.exports = { roleCheck };
