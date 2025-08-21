const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function orderedPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

async function createFriendRequest(fromId, { toEmail, toUserId }) {
  let toId = null;

  if (toUserId) {
    toId = Number(toUserId);
  } else if (toEmail) {
    const u = await prisma.user.findUnique({ where: { email: toEmail } });
    if (!u) throw new Error("User not found");
    toId = u.id;
  } else {
    throw new Error("toEmail or toUserId is required");
  }

  if (toId === fromId) throw new Error("Cannot send request to yourself");

  const [a, b] = orderedPair(fromId, toId);
  const existingFriend = await prisma.friendship.findFirst({ where: { userAId: a, userBId: b } });
  if (existingFriend) throw new Error("Already friends");

  const pending = await prisma.friendRequest.findFirst({
    where: {
      status: "PENDING",
      OR: [{ fromId, toId }, { fromId: toId, toId: fromId }],
    },
  });
  if (pending) throw new Error("There is already a pending request between you");

  return prisma.friendRequest.create({
    data: { fromId, toId, status: "PENDING" },
    select: {
      id: true, fromId: true, toId: true, status: true, createdAt: true,
      from: { select: { id: true, email: true, name: true } },
      to:   { select: { id: true, email: true, name: true } },
    },
  });
}

async function listFriendRequests(userId, direction) {
  let where;
  if (direction === "incoming") where = { toId: userId };
  else if (direction === "outgoing") where = { fromId: userId };
  else where = { OR: [{ toId: userId }, { fromId: userId }] };

  return prisma.friendRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, status: true, createdAt: true, updatedAt: true,
      from: { select: { id: true, email: true, name: true } },
      to:   { select: { id: true, email: true, name: true } },
    },
  });
}

async function updateFriendRequest(actorId, requestId, action) {
  const fr = await prisma.friendRequest.findUnique({ where: { id: Number(requestId) } });
  if (!fr) throw new Error("Request not found");
  if (fr.status !== "PENDING") throw new Error("Request is not pending");

  if ((action === "ACCEPT" || action === "REJECT") && fr.toId !== actorId) {
    throw new Error("Not authorized to respond to this request");
  }
  if (action === "CANCEL" && fr.fromId !== actorId) {
    throw new Error("Not authorized to cancel this request");
  }

  if (action === "ACCEPT") {
    const [a, b] = orderedPair(fr.fromId, fr.toId);
    return prisma.$transaction(async (tx) => {
      await tx.friendship.create({ data: { userAId: a, userBId: b } });
      const updated = await tx.friendRequest.update({
        where: { id: fr.id },
        data: { status: "ACCEPTED" },
        select: { id: true, status: true, fromId: true, toId: true, updatedAt: true },
      });
      return updated;
    });
  }

  const next = action === "REJECT" ? "REJECTED" : "CANCELED";
  return prisma.friendRequest.update({
    where: { id: fr.id },
    data: { status: next },
    select: { id: true, status: true, updatedAt: true },
  });
}

async function listFriends(userId) {
  const rows = await prisma.friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    select: {
      id: true, userAId: true, userBId: true, createdAt: true,
      userA: { select: { id: true, email: true, name: true } },
      userB: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => {
    const friend = r.userAId === userId ? r.userB : r.userA;
    return { id: friend.id, email: friend.email, name: friend.name, since: r.createdAt };
  });
}

async function removeFriend(userId, friendUserId) {
  const [a, b] = orderedPair(userId, Number(friendUserId));
  const rel = await prisma.friendship.findFirst({ where: { userAId: a, userBId: b } });
  if (!rel) throw new Error("You are not friends");
  await prisma.friendship.delete({ where: { id: rel.id } });
}

module.exports = {
  createFriendRequest,
  listFriendRequests,
  updateFriendRequest,
  listFriends,
  removeFriend,
};
