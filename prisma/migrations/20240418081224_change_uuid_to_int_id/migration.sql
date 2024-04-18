/*
  Warnings:

  - The primary key for the `attestation_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `attestation_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "attestation_records" DROP CONSTRAINT "attestation_records_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "attestation_records_pkey" PRIMARY KEY ("id");
