const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token var mı kontrolü
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded içinden user bilgilerini req içine ekle
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next(); // → bir sonraki middleware'e geç
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
