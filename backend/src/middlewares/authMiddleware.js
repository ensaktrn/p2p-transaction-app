const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  req.token = token; // Logout için saklıyoruz

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // ❗ Token blackliste alınmış mı?
    const isBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (isBlacklisted) {
      return res.status(401).json({ error: "Token is blacklisted" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
