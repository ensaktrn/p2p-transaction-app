const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Kullanıcı bilgilerini ID ile alma işlemi
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      balance: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Kullanıcı silme işlemi 
const deleteUserById = async (id) => {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  
    return deletedUser;
  };

module.exports = {
  getUserById,
  deleteUserById
};
