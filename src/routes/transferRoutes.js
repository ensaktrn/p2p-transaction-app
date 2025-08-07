const express = require('express');
const router = express.Router();

const { handleTransfer } = require('../controllers/transferController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, handleTransfer);

module.exports = router;
