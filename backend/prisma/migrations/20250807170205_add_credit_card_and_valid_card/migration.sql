-- CreateTable
CREATE TABLE "public"."ValidCard" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "expMonth" INTEGER NOT NULL,
    "expYear" INTEGER NOT NULL,

    CONSTRAINT "ValidCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidCard_cardNumber_key" ON "public"."ValidCard"("cardNumber");
