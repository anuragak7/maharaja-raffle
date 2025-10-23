-- CreateTable
CREATE TABLE "RaffleEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "sourceIp" TEXT,
    "userAgent" TEXT,
    "deletedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "RaffleEntry_phone_key" ON "RaffleEntry"("phone");

-- CreateIndex
CREATE INDEX "RaffleEntry_createdAt_idx" ON "RaffleEntry"("createdAt");

-- CreateIndex
CREATE INDEX "RaffleEntry_phone_idx" ON "RaffleEntry"("phone");
