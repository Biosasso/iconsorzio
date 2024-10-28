/*
  Warnings:

  - The primary key for the `AllievoIstruzione` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AllievoServizio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allievoId` on the `AllievoServizio` table. All the data in the column will be lost.
  - You are about to drop the column `esaminatoreId` on the `AllievoServizio` table. All the data in the column will be lost.
  - You are about to drop the column `marcaOperativaId` on the `AllievoServizio` table. All the data in the column will be lost.
  - You are about to drop the column `patenteId` on the `AllievoServizio` table. All the data in the column will be lost.
  - The required column `id` was added to the `AllievoIstruzione` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `allievoIStruzioneId` to the `AllievoServizio` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `AllievoServizio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "AllievoServizio" DROP CONSTRAINT "AllievoServizio_companyId_allievoId_patenteId_marcaOperati_fkey";

-- DropForeignKey
ALTER TABLE "AllievoServizio" DROP CONSTRAINT "AllievoServizio_esaminatoreId_fkey";

-- AlterTable
ALTER TABLE "AllievoIstruzione" DROP CONSTRAINT "AllievoIstruzione_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "AllievoIstruzione_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AllievoServizio" DROP CONSTRAINT "AllievoServizio_pkey",
DROP COLUMN "allievoId",
DROP COLUMN "esaminatoreId",
DROP COLUMN "marcaOperativaId",
DROP COLUMN "patenteId",
ADD COLUMN     "allievoIStruzioneId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "dataServizio" DROP NOT NULL,
ADD CONSTRAINT "AllievoServizio_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_allievoIStruzioneId_fkey" FOREIGN KEY ("allievoIStruzioneId") REFERENCES "AllievoIstruzione"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
