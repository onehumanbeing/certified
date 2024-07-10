-- CreateTable
CREATE TABLE "editionCOA" (
    "id" SERIAL NOT NULL,
    "attestationId" TEXT NOT NULL,
    "edition" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "editionCOA_pkey" PRIMARY KEY ("id")
);
