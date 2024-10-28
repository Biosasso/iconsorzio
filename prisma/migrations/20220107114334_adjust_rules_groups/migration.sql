/*
  Warnings:

  - You are about to drop the column `rulesId` on the `CompanyRulesGroup` table. All the data in the column will be lost.
  - Added the required column `ruleId` to the `CompanyRulesGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CompanyRulesGroup" DROP CONSTRAINT "CompanyRulesGroup_rulesId_fkey";

-- AlterTable
ALTER TABLE "CompanyRulesGroup" DROP COLUMN "rulesId",
ADD COLUMN     "ruleId" TEXT NOT NULL,
ADD COLUMN     "rulesGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "CompanyRulesGroup" ADD CONSTRAINT "CompanyRulesGroup_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyRulesGroup" ADD CONSTRAINT "CompanyRulesGroup_rulesGroupId_fkey" FOREIGN KEY ("rulesGroupId") REFERENCES "RulesGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
