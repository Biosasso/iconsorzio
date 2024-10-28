/*
  Warnings:

  - Added the required column `accessCode` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "accessCode" TEXT NOT NULL;
