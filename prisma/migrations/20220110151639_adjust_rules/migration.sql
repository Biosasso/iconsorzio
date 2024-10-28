/*
  Warnings:

  - You are about to drop the column `userId` on the `UserRules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_userId_fkey";

-- AlterTable
ALTER TABLE "UserRules" DROP COLUMN "userId";
