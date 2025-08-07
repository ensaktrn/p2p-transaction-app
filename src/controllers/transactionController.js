const { getUserTransactions } = require("../services/transactionService");

const listTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await getUserTransactions(userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to load transactions" });
  }
};

module.exports = {
  listTransactions,
};
