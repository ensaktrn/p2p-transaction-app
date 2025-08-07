const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
  
    next();
  };
  
  module.exports = isAdmin;
  