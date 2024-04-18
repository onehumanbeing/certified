-- CreateTable
CREATE TABLE "attestation_records" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expirationAt" TIMESTAMP(3) NOT NULL,
    "schemaId" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "template" TEXT NOT NULL,

    CONSTRAINT "attestation_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attestation_records_email_key" ON "attestation_records"("email");

-- CreateIndex
CREATE UNIQUE INDEX "attestation_records_walletAddress_key" ON "attestation_records"("walletAddress");

-- AddForeignKey
ALTER TABLE "attestation_records" ADD CONSTRAINT "attestation_records_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "user_schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
