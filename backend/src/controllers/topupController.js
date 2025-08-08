const { topUpBalance } = require('../services/topupService');

const handleTopUp = async (req, res) => {
  const userId = req.user.id;
  const { cardId, amount } = req.body;

  try {
    const updatedUser = await topUpBalance(userId, { cardId, amount });

    res.status(200).json({
      message: "Balance topped up successfully",
      balance: updatedUser.balance,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  handleTopUp,
};
