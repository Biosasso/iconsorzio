-- DropForeignKey
ALTER TABLE "ActiveCompany" DROP CONSTRAINT "ActiveCompany_userId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_companyId_fkey";

-- DropForeignKey
ALTER TABLE "UserPassword" DROP CONSTRAINT "UserPassword_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsersCompanies" DROP CONSTRAINT "UsersCompanies_companyId_fkey";

-- DropForeignKey
ALTER TABLE "UsersCompanies" DROP CONSTRAINT "UsersCompanies_userId_fkey";

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCompany" ADD CONSTRAINT "ActiveCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
