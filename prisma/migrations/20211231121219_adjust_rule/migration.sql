/*
  Warnings:

  - Added the required column `companyId` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "companyId" TEXT NOT NULL;
