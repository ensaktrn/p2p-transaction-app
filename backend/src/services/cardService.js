const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCreditCard = async (userId, cardData) => {
  const { cardNumber, cvv, expMonth, expYear } = cardData;

  // 1. ValidCard kontrolü
  const isValid = await prisma.validCard.findFirst({
    where: {
      cardNumber,
      cvv,
      expMonth,
      expYear,
    },
  });

  if (!isValid) {
    throw new Error('Invalid credit card');
  }

  // 2. Aynı kart daha önce bu kullanıcı tarafından eklenmiş mi?
  const existing = await prisma.creditCard.findFirst({
    where: {
      userId,
      cardNumber,
    },
  });

  if (existing) {
    throw new Error('You already added this card');
  }

  // 3. Kartı ekle
  const newCard = await prisma.creditCard.create({
    data: {
      userId,
      cardNumber,
      cvv,
      expMonth,
      expYear,
    },
  });

  return newCard;
};

// kullanıcının kartlarını listeleme
const getUserCards = async (userId) => {
    const cards = await prisma.creditCard.findMany({
      where: { userId },
      select: {
        id: true,
        cardNumber: true,
        expMonth: true,
        expYear: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    // Son 4 hane dışında kart numarasını gönderme
    return cards.map((card) => ({
      id: card.id,
      last4: card.cardNumber.slice(-4),
      expMonth: card.expMonth,
      expYear: card.expYear,
      createdAt: card.createdAt,
    }));
  };
  
module.exports = {
  addCreditCard,
  getUserCards,
};
