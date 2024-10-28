/*
  Warnings:

  - Added the required column `bgColor` to the `Rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rules" ADD COLUMN     "bgColor" TEXT NOT NULL;
