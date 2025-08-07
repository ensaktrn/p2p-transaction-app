const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const registerUser = async ({ email, password, name }) => {
  // E-posta kontrolü
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('This email is already used.');
  }

  // Şifre hash'leme
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kullanıcı oluştur
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new Error('Wrong email or password.');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new Error('Wrong email or password.');
    }
  
    // Token üretimi
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  
    return { token, user };
  };

const logoutUser = async (token, expiresAt) => {
  await prisma.blacklistedToken.create({
    data: {
      token,
      expiresAt,
    },
  });
};  
  
  module.exports = {
    registerUser,
    loginUser,
    logoutUser
  };