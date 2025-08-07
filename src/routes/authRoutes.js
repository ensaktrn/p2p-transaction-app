const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

// POST /auth/register
router.post('/register', register);
// POST /auth/login
router.post('/login', login);

// GET /auth/me - Kullanıcının kimliğini doğrulamak için
router.get('/me', authenticate, (req, res) => {
    res.json({
      message: 'Token is valid',
      user: req.user,
    });
  });

module.exports = router;