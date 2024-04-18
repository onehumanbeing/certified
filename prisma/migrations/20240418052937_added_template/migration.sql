/*
  Warnings:

  - Added the required column `template` to the `user_schemas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_schemas" ADD COLUMN "template" TEXT;
