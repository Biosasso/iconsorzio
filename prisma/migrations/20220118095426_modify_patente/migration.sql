/*
  Warnings:

  - You are about to drop the column `descrizione` on the `Patente` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Patente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patente" DROP COLUMN "descrizione",
ADD COLUMN     "nome" TEXT NOT NULL;
