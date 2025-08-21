const svc = require("../services/friendService");

async function createFriendRequest(req, res) {
  const userId = req.user.id; // authenticate middleware set ediyor
  const { toEmail, toUserId } = req.body;
  try {
    const fr = await svc.createFriendRequest(userId, { toEmail, toUserId });
    res.status(201).json(fr);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to create request" });
  }
}

async function listFriendRequests(req, res) {
  const userId = req.user.id;
  const direction = (req.query.direction || "all").toString(); // incoming|outgoing|all
  try {
    const data = await svc.listFriendRequests(userId, direction);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to list requests" });
  }
}

async function updateFriendRequest(req, res) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { action } = req.body; // "ACCEPT" | "REJECT" | "CANCEL"
  try {
    const data = await svc.updateFriendRequest(userId, id, action);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to update request" });
  }
}

async function listFriends(req, res) {
  const userId = req.user.id;
  try {
    const data = await svc.listFriends(userId);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to list friends" });
  }
}

async function removeFriend(req, res) {
  const userId = req.user.id;
  const friendUserId = Number(req.params.friendUserId);
  try {
    await svc.removeFriend(userId, friendUserId);
    res.json({ message: "Friend removed" });
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to remove friend" });
  }
}

module.exports = {
  createFriendRequest,
  listFriendRequests,
  updateFriendRequest,
  listFriends,
  removeFriend,
};
