/*
  Warnings:

  - Added the required column `veicoloId` to the `AllievoServizio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllievoServizio" ADD COLUMN     "veicoloId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_veicoloId_fkey" FOREIGN KEY ("veicoloId") REFERENCES "Veicolo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
