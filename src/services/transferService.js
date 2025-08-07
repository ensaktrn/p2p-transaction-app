const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const transferMoney = async ({ senderId, receiverEmail, amount }) => {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
  
    const sender = await prisma.user.findUnique({
      where: { id: senderId }, // ✅ artık doğru gelecek
    });
  
    if (!sender) {
      throw new Error("Sender not found");
    }
  
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });
  
    if (!receiver) {
      throw new Error("Receiver not found");
    }
  
    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }
  
    const [updatedSender, updatedReceiver] = await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } },
      }),
      prisma.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: amount } },
      }),
    ]);
  
    await prisma.transaction.create({
      data: {
        senderId,
        receiverId: receiver.id,
        amount,
      },
    });
  
    return {
      sender: {
        id: updatedSender.id,
        balance: updatedSender.balance,
      },
      receiver: {
        id: updatedReceiver.id,
        balance: updatedReceiver.balance,
      },
    };
  };
  
  

module.exports = {
  transferMoney,
};
