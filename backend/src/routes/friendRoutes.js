const express = require("express");
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {createFriendRequest,listFriendRequests,updateFriendRequest,listFriends,removeFriend,} = require("../controllers/friendController");

// Friend requests
router.post("/requests", authenticate, createFriendRequest);           // { toEmail? toUserId? }
router.get("/requests", authenticate, listFriendRequests);            // ?direction=incoming|outgoing|all
router.patch("/requests/:id", authenticate, updateFriendRequest);     // { action: "ACCEPT"|"REJECT"|"CANCEL" }

// Friendships
router.get("/", authenticate, listFriends);
router.delete("/:friendUserId", authenticate, removeFriend);

module.exports = router;
