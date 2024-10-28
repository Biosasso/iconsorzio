/*
  Warnings:

  - Added the required column `companyId` to the `UserRules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_userId_fkey";

-- AlterTable
ALTER TABLE "UserRules" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserRules" ADD CONSTRAINT "UserRules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRules" ADD CONSTRAINT "UserRules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
