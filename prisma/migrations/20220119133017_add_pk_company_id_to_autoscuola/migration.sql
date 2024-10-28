/*
  Warnings:

  - The primary key for the `Autoscuola` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Autoscuola" DROP CONSTRAINT "Autoscuola_pkey",
ADD CONSTRAINT "Autoscuola_pkey" PRIMARY KEY ("id", "companyId");
