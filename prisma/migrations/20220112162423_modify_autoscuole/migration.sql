/*
  Warnings:

  - The primary key for the `autoscuole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `companyId` on table `autoscuole` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "autoscuole" DROP CONSTRAINT "autoscuole_companyId_fkey";

-- AlterTable
ALTER TABLE "autoscuole" DROP CONSTRAINT "autoscuole_pkey",
ALTER COLUMN "companyId" SET NOT NULL,
ADD CONSTRAINT "autoscuole_pkey" PRIMARY KEY ("id", "companyId");

-- AddForeignKey
ALTER TABLE "autoscuole" ADD CONSTRAINT "autoscuole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
