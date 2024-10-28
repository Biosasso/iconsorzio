-- AlterTable
ALTER TABLE "UsersCompanies" ADD COLUMN     "rulesGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_rulesGroupId_fkey" FOREIGN KEY ("rulesGroupId") REFERENCES "RulesGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
