-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_ruleId_fkey";

-- AddForeignKey
ALTER TABLE "UserRules" ADD CONSTRAINT "UserRules_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
