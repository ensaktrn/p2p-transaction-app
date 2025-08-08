const express = require('express');
const router = express.Router();

const { createCard, listUserCards } = require('../controllers/cardController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', authenticate, createCard);
router.get('/', authenticate, listUserCards);

module.exports = router;
