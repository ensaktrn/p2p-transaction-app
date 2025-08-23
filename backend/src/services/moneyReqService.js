const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// (opsiyonel) arkadaşa zorunlu kılmak istersen ilişkileri kontrol et
async function assertFriends(userAId, userBId) {
  const a = Math.min(userAId, userBId), b = Math.max(userAId, userBId);
  const rel = await prisma.friendship.findFirst({ where: { userAId: a, userBId: b } });
  if (!rel) throw new Error("You can only request money from friends");
}

async function createRequest(fromId, { toEmail, toUserId, amount, note }) {
  if (!amount || Number(amount) <= 0) throw new Error("Amount must be > 0");

  let toId = null;
  if (toUserId) toId = Number(toUserId);
  else if (toEmail) {
    const u = await prisma.user.findUnique({ where: { email: toEmail } });
    if (!u) throw new Error("User not found");
    toId = u.id;
  } else {
    throw new Error("toEmail or toUserId is required");
  }
  if (toId === fromId) throw new Error("Cannot request from yourself");

  await assertFriends(fromId, toId);

  return prisma.moneyRequest.create({
    data: { fromId, toId, amount: Number(amount), note },
    select: {
      id: true, status: true, amount: true, note: true, createdAt: true,
      from: { select: { id: true, email: true, name: true } },
      to:   { select: { id: true, email: true, name: true } },
    },
  });
}

async function listRequests(userId, direction = "all", status, months, limit) {
  let whereBase;
  if (direction === "incoming") whereBase = { toId: userId };
  else if (direction === "outgoing") whereBase = { fromId: userId };
  else whereBase = { OR: [{ toId: userId }, { fromId: userId }] };

  if (status) whereBase = { ...whereBase, status };

  let dateFilter = undefined;
  if (months && [1, 3].includes(Number(months))) {
    const from = new Date();
    from.setMonth(from.getMonth() - Number(months));
    dateFilter = { gte: from };
  }

  return prisma.moneyRequest.findMany({
    where: { ...whereBase, ...(dateFilter ? { createdAt: dateFilter } : {}) },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: Number(limit) } : {}),
    select: {
      id: true, status: true, amount: true, note: true, createdAt: true, updatedAt: true,
      from: { select: { id: true, email: true, name: true } },
      to:   { select: { id: true, email: true, name: true } },
    },
  });
}

async function updateRequest(actorId, id, action) {
  const mr = await prisma.moneyRequest.findUnique({ where: { id: Number(id) } });
  if (!mr) throw new Error("Request not found");
  if (mr.status !== "PENDING" && action !== "PAY") throw new Error("Request is not pending");

  // Kurallar:
  // - PAY/REJECT: sadece toId (ödeyecek kişi)
  // - CANCEL: sadece fromId (talep eden)
  if (action === "PAY" || action === "REJECT") {
    if (mr.toId !== actorId) throw new Error("Not authorized");
  } else if (action === "CANCEL") {
    if (mr.fromId !== actorId) throw new Error("Not authorized");
  }

  if (action === "PAY") {
    // ÖDEME: mr.toId -> mr.fromId TRANSFER
    const amount = Number(mr.amount);
    if (amount <= 0) throw new Error("Invalid amount");

    return prisma.$transaction(async (tx) => {
      const payer = await tx.user.findUnique({ where: { id: mr.toId } });
      if (!payer || payer.balance < amount) throw new Error("Insufficient balance");

      // bakiyeleri güncelle
      await tx.user.update({ where: { id: mr.toId }, data: { balance: { decrement: amount } } });
      await tx.user.update({ where: { id: mr.fromId }, data: { balance: { increment: amount } } });

      // transaction kaydı
      await tx.transaction.create({
        data: {
          type: "TRANSFER",
          senderId: mr.toId,
          receiverId: mr.fromId,
          amount,
        },
      });

      // request'i PAID yap
      const updated = await tx.moneyRequest.update({
        where: { id: mr.id },
        data: { status: "PAID" },
        select: { id: true, status: true, updatedAt: true },
      });

      return updated;
    });
  }

  // REJECT veya CANCEL
  const next = action === "REJECT" ? "REJECTED" : "CANCELED";
  return prisma.moneyRequest.update({
    where: { id: mr.id },
    data: { status: next },
    select: { id: true, status: true, updatedAt: true },
  });
}

module.exports = {
  createRequest,
  listRequests,
  updateRequest,
};
