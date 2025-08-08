const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cards = [
    {
      cardNumber: '4111111111111111',
      cvv: '123',
      expMonth: 12,
      expYear: 2026,
    },
    {
      cardNumber: '5500000000000004',
      cvv: '456',
      expMonth: 6,
      expYear: 2025,
    },
    {
      cardNumber: '340000000000009',
      cvv: '789',
      expMonth: 9,
      expYear: 2027,
    },
    {
      cardNumber: '30000000000004',
      cvv: '321',
      expMonth: 3,
      expYear: 2024,
    },
    {
      cardNumber: '6011000000000004',
      cvv: '555',
      expMonth: 11,
      expYear: 2028,
    }
  ];

  for (const card of cards) {
    await prisma.validCard.upsert({
      where: { cardNumber: card.cardNumber },
      update: {},
      create: card,
    });
  }

  console.log('✅ Valid cards seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
