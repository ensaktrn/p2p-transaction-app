const { getUserById, deleteUserById, updateUserById, getAllUsers } = require('../services/userService');

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

  
const updateUser = async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  // Sadece kendisi veya admin güncelleyebilir
  if (requestedId !== requesterId && requesterRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: You cannot update this user' });
  }

  try {
    const updatedUser = await updateUserById(requestedId, req.body);

    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};  
// user listesi getirme işlemi admine ozel
const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getUser,
  deleteUser,
  updateUser,
  listUsers
};
