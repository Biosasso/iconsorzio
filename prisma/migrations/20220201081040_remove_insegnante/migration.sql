/*
  Warnings:

  - You are about to drop the column `insegnanteId` on the `AllievoServizio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AllievoServizio" DROP CONSTRAINT "AllievoServizio_insegnanteId_fkey";

-- AlterTable
ALTER TABLE "AllievoServizio" DROP COLUMN "insegnanteId";
