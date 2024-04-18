/*
  Warnings:

  - Made the column `template` on table `user_schemas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_schemas" ALTER COLUMN "template" SET NOT NULL;
