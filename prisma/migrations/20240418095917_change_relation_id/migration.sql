-- DropForeignKey
ALTER TABLE "attestation_records" DROP CONSTRAINT "attestation_records_schemaId_fkey";

-- AddForeignKey
ALTER TABLE "attestation_records" ADD CONSTRAINT "attestation_records_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "user_schemas"("schemaId") ON DELETE RESTRICT ON UPDATE CASCADE;
