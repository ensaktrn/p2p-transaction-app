const svc = require("../services/moneyReqService");

async function create(req, res) {
  const userId = req.user.id;
  const { toEmail, toUserId, amount, note } = req.body;
  try {
    const data = await svc.createRequest(userId, { toEmail, toUserId, amount, note });
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to create money request" });
  }
}

async function list(req, res) {
  const userId    = req.user.id;
  const direction = (req.query.direction || "all").toString();     // incoming|outgoing|all
  const status    = req.query.status ? req.query.status.toString() : undefined; // PENDING|PAID|REJECTED|CANCELED
  const months    = req.query.months ? Number(req.query.months) : undefined;    // 1|3
  const limit     = req.query.limit ? Number(req.query.limit) : undefined;

  try {
    const data = await svc.listRequests(userId, direction, status, months, limit);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to list money requests" });
  }
}

async function update(req, res) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { action } = req.body; // "PAY" | "REJECT" | "CANCEL"
  try {
    const data = await svc.updateRequest(userId, id, action);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to update money request" });
  }
}

module.exports = { create, list, update };
