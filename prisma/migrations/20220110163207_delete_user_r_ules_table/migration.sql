/*
  Warnings:

  - You are about to drop the `UserRules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_companyId_fkey";

-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_ruleId_fkey";

-- DropTable
DROP TABLE "UserRules";
