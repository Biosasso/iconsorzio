/*
  Warnings:

  - Added the required column `isActive` to the `UsersCompanies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersCompanies" ADD COLUMN     "isActive" TEXT NOT NULL;
