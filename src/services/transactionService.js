const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserTransactions = async (userId) => {
  const [sent, received] = await Promise.all([
    prisma.transaction.findMany({
      where: { senderId: userId },
      include: { receiver: true },
    }),
    prisma.transaction.findMany({
      where: { receiverId: userId },
      include: { sender: true },
    }),
  ]);

  // Format
  const sentFormatted = sent.map((tx) => ({
    id: tx.id,
    type: "sent",
    to: tx.receiver.email,
    amount: tx.amount,
    date: tx.createdAt,
  }));

  const receivedFormatted = received.map((tx) => ({
    id: tx.id,
    type: "received",
    from: tx.sender.email,
    amount: tx.amount,
    date: tx.createdAt,
  }));

  return [...sentFormatted, ...receivedFormatted].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};

module.exports = {
  getUserTransactions,
};
