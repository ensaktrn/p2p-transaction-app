const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const topUpBalance = async (userId, { cardId, amount }) => {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  // Kullanıcının bu karta sahip olduğuna emin ol
  const card = await prisma.creditCard.findUnique({
    where: { id: cardId },
  });

  if (!card || card.userId !== userId) {
    throw new Error("Card not found or unauthorized");
  }

  // ValidCard tablosundan eşleşen kartı bul
  const validCard = await prisma.validCard.findFirst({
    where: {
      cardNumber: card.cardNumber,
      cvv: card.cvv,
      expMonth: card.expMonth,
      expYear: card.expYear,
    },
  });

  if (!validCard) throw new Error("This card is not valid");

  if (validCard.balance < amount) {
    throw new Error("Insufficient card balance");
  }

  // İşlem: kullanıcının balance'ını arttır, kartınkini azalt
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      balance: { increment: amount },
    },
  });

  await prisma.validCard.update({
    where: { id: validCard.id },
    data: {
      balance: { decrement: amount },
    },
  });

  return updatedUser;
};

module.exports = {
  topUpBalance,
};
