/*
  Warnings:

  - You are about to drop the column `nome` on the `Tariffa` table. All the data in the column will be lost.
  - Added the required column `patenteId` to the `Tariffa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tariffa" DROP COLUMN "nome",
ADD COLUMN     "patenteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tariffa" ADD CONSTRAINT "Tariffa_patenteId_fkey" FOREIGN KEY ("patenteId") REFERENCES "Patente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
