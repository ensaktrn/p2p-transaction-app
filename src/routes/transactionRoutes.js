const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");1
const { listTransactions } = require("../controllers/transactionController");

router.get("/", authenticate, listTransactions);

module.exports = router;
