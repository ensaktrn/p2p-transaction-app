const express = require('express');
const router = express.Router();

const { handleTopUp } = require('../controllers/topupController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, handleTopUp);

module.exports = router;
