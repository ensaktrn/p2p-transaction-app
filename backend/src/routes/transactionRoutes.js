const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");1
const { listUserTransactions } = require("../controllers/transactionController");

router.get("/", authenticate, listUserTransactions);

module.exports = router;
