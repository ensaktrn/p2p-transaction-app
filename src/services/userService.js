const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

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

const updateUserById = async (id, updateData) => {
  const dataToUpdate = {};
  
  if (updateData.name) {
    dataToUpdate.name = updateData.name;
    }
  
  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    dataToUpdate.password = hashedPassword;
    }
  
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: dataToUpdate,
  });

  return updatedUser;
};  

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      balance: true,
    },
  });

  return users;
};

module.exports = {
  getUserById,
  deleteUserById,
  updateUserById,
  getAllUsers
};
