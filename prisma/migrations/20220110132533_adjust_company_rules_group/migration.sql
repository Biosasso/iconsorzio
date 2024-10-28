-- DropForeignKey
ALTER TABLE "CompanyRulesGroup" DROP CONSTRAINT "CompanyRulesGroup_rulesGroupId_fkey";

-- AddForeignKey
ALTER TABLE "CompanyRulesGroup" ADD CONSTRAINT "CompanyRulesGroup_rulesGroupId_fkey" FOREIGN KEY ("rulesGroupId") REFERENCES "RulesGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
