/*
  Warnings:

  - The primary key for the `UserRules` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_pkey",
ADD CONSTRAINT "UserRules_pkey" PRIMARY KEY ("ruleId", "userId");
