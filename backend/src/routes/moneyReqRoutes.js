const express = require("express");
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {create, list, update, } = require("../controllers/moneyReqController");

router.post("/", authenticate, create);                 // { toEmail|toUserId, amount, note? }
router.get("/", authenticate, list);                    // ?direction=incoming|outgoing|all&status=PENDING
router.patch("/:id", authenticate, update);             // { action: "PAY"|"REJECT"|"CANCEL" }

module.exports = router;
