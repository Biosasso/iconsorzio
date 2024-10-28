/*
  Warnings:

  - Added the required column `companyId` to the `Tariffa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tariffa" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tariffa" ADD CONSTRAINT "Tariffa_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
