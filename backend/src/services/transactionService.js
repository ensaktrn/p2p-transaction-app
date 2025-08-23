const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Filters:
 * - limit: son N (örn: 10)
 * - months: 1 | 3
 * - type: "all" | "topup" | "sent" | "received"
 */
async function getUserTransactions(userId, { limit, months, type = "all" }) {
  let dateFilter = undefined;
  if (months && [1, 3].includes(Number(months))) {
    const from = new Date();
    from.setMonth(from.getMonth() - Number(months));
    dateFilter = { gte: from };
  }

  const queries = [];

  if (type === "all" || type === "sent") {
    queries.push(
      prisma.transaction.findMany({
        where: { senderId: userId, type: "TRANSFER", ...(dateFilter ? { createdAt: dateFilter } : {}) },
        include: { receiver: true },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: Number(limit) } : {}),
      })
    );
  }

  if (type === "all" || type === "received") {
    queries.push(
      prisma.transaction.findMany({
        where: { receiverId: userId, type: "TRANSFER", ...(dateFilter ? { createdAt: dateFilter } : {}) },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: Number(limit) } : {}),
      })
    );
  }

  if (type === "all" || type === "topup") {
    queries.push(
      prisma.transaction.findMany({
        where: { receiverId: userId, type: "TOPUP", ...(dateFilter ? { createdAt: dateFilter } : {}) },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: Number(limit) } : {}),
      })
    );
  }

  const arrays = await Promise.all(queries);
  const merged = arrays.flat();

  const formatted = merged
    .map((tx) => {
      if (tx.type === "TOPUP") {
        return { id: tx.id, type: "topup", amount: tx.amount, date: tx.createdAt };
      }
      if (tx.senderId === userId) {
        return { id: tx.id, type: "sent", amount: tx.amount, date: tx.createdAt, to: tx.receiver?.email };
      }
      return { id: tx.id, type: "received", amount: tx.amount, date: tx.createdAt, from: tx.sender?.email };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return limit ? formatted.slice(0, Number(limit)) : formatted;
}

module.exports = { getUserTransactions };
