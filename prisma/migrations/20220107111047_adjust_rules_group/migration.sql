/*
  Warnings:

  - You are about to drop the column `companyRulesGroupId` on the `RulesGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RulesGroup" DROP CONSTRAINT "RulesGroup_companyRulesGroupId_fkey";

-- AlterTable
ALTER TABLE "RulesGroup" DROP COLUMN "companyRulesGroupId";

-- AddForeignKey
ALTER TABLE "CompanyRulesGroup" ADD CONSTRAINT "CompanyRulesGroup_rulesId_fkey" FOREIGN KEY ("rulesId") REFERENCES "RulesGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
