const express = require('express');
const router = express.Router();
const { getUser, deleteUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

// Korumalı endpoint: sadece giriş yapmış kullanıcılar erişebilir
router.get('/:id', authenticate, getUser);
router.delete('/:id', authenticate, deleteUser);


module.exports = router;
