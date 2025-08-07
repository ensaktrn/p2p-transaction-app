const { getUserById, deleteUserById } = require('../services/userService');

const getUser = async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  // Kullanıcı kendisi değilse ve admin değilse: yasak
  if (requestedId !== requesterId && requesterRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: You are not allowed to view this user' });
  }

  try {
    const user = await getUserById(requestedId);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

// Kullanıcı silme işlemi
const deleteUser = async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
  
    // Yetki kontrolü
    if (requestedId !== requesterId && requesterRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this user' });
    }
  
    try {
      await deleteUserById(requestedId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  };

module.exports = {
  getUser,
  deleteUser
};
