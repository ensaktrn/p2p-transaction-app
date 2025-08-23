-- CreateEnum
CREATE TYPE "public"."MoneyRequestStatus" AS ENUM ('PENDING', 'PAID', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "public"."MoneyRequest" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "status" "public"."MoneyRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoneyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MoneyRequest_toId_idx" ON "public"."MoneyRequest"("toId");

-- CreateIndex
CREATE INDEX "MoneyRequest_fromId_idx" ON "public"."MoneyRequest"("fromId");

-- AddForeignKey
ALTER TABLE "public"."MoneyRequest" ADD CONSTRAINT "MoneyRequest_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MoneyRequest" ADD CONSTRAINT "MoneyRequest_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

