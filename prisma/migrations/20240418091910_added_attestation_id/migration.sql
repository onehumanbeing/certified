/*
  Warnings:

  - A unique constraint covering the columns `[attestationId]` on the table `attestation_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attestationId` to the `attestation_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attestation_records" ADD COLUMN     "attestationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attestation_records_attestationId_key" ON "attestation_records"("attestationId");
