/*
  Warnings:

  - You are about to drop the column `usersRulesGroupId` on the `RulesGroup` table. All the data in the column will be lost.
  - You are about to drop the `UsersRulesGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RulesGroup" DROP CONSTRAINT "RulesGroup_usersRulesGroupId_fkey";

-- DropForeignKey
ALTER TABLE "UsersRulesGroup" DROP CONSTRAINT "UsersRulesGroup_companyId_fkey";

-- AlterTable
ALTER TABLE "RulesGroup" DROP COLUMN "usersRulesGroupId",
ADD COLUMN     "companyRulesGroupId" TEXT;

-- DropTable
DROP TABLE "UsersRulesGroup";

-- CreateTable
CREATE TABLE "CompanyRulesGroup" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "rulesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CompanyRulesGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RulesGroup" ADD CONSTRAINT "RulesGroup_companyRulesGroupId_fkey" FOREIGN KEY ("companyRulesGroupId") REFERENCES "CompanyRulesGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyRulesGroup" ADD CONSTRAINT "CompanyRulesGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
