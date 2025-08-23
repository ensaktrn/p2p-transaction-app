const txService = require("../services/transactionService");

async function listUserTransactions(req, res) {
  try {
    const userId = req.user.id;
    // FE'den şu şekilde gelecek:
    // ?limit=10 | ?months=1|3 | ?type=all|topup|sent|received
    const limit  = req.query.limit ? Number(req.query.limit) : undefined;
    const months = req.query.months ? Number(req.query.months) : undefined;
    const type   = (req.query.type || "all").toString();

    const data = await txService.getUserTransactions(userId, { limit, months, type });
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to list transactions" });
  }
}

module.exports = { listUserTransactions };
