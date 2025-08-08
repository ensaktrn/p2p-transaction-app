const { addCreditCard, getUserCards } = require('../services/cardService');

const createCard = async (req, res) => {
  const userId = req.user.id;
  const cardData = req.body;

  try {
    const card = await addCreditCard(userId, cardData);

    res.status(201).json({
      message: 'Card added successfully',
      card: {
        id: card.id,
        last4: card.cardNumber.slice(-4),
        expMonth: card.expMonth,
        expYear: card.expYear,
      },
    });
  } catch (err) {
    const code = err.message.includes('already') ? 409 : 400;
    res.status(code).json({ error: err.message });
  }
};

// kullanıcının kartlarını listeleme
const listUserCards = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const cards = await getUserCards(userId);
      res.json(cards);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  };
module.exports = {
  createCard,
  listUserCards,
};
