/*
  Warnings:

  - You are about to drop the column `companiesId` on the `UsersCompanies` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `UsersCompanies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersCompanies" DROP CONSTRAINT "UsersCompanies_companiesId_fkey";

-- AlterTable
ALTER TABLE "UsersCompanies" DROP COLUMN "companiesId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
