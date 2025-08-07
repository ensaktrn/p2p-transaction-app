const express = require('express');
const router = express.Router();
const { getUser, deleteUser, updateUser, listUsers } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Korumalı endpoint: sadece giriş yapmış kullanıcılar erişebilir
router.get('/:id', authenticate, getUser);
router.delete('/:id', authenticate, deleteUser);
router.patch('/:id', authenticate, updateUser);
router.get('/', authenticate, isAdmin, listUsers);


module.exports = router;
