const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserTransactions = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return transactions.map((tx) => {
    if (tx.type === "TOPUP") {
      return {
        id: tx.id,
        type: "topup",
        amount: tx.amount,
        date: tx.createdAt,
      };
    }

    if (tx.senderId === userId) {
      return {
        id: tx.id,
        type: "sent",
        to: tx.receiver?.email,
        amount: tx.amount,
        date: tx.createdAt,
      };
    }

    return {
      id: tx.id,
      type: "received",
      from: tx.sender?.email,
      amount: tx.amount,
      date: tx.createdAt,
    };
  });
};


module.exports = {
  getUserTransactions,
};
