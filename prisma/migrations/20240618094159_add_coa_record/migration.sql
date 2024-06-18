-- CreateTable
CREATE TABLE "COARecord" (
    "id" SERIAL NOT NULL,
    "attestationId" TEXT NOT NULL,
    "attester" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "edition" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "COARecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "COARecord_attestationId_key" ON "COARecord"("attestationId");
