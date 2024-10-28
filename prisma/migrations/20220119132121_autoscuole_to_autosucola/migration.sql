/*
  Warnings:

  - You are about to drop the `Autoscuole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Autoscuole" DROP CONSTRAINT "Autoscuole_companyId_fkey";

-- DropTable
DROP TABLE "Autoscuole";

-- CreateTable
CREATE TABLE "Autoscuola" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "denominazione" TEXT NOT NULL,
    "consorzio_toggle" BOOLEAN NOT NULL DEFAULT true,
    "rag_soc" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "n_civ" TEXT NOT NULL,
    "cod_fisc" TEXT NOT NULL,
    "part_iva" TEXT NOT NULL,
    "cod_motorizzazione" TEXT NOT NULL,
    "tel_1" TEXT NOT NULL,
    "tel_2" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pec" TEXT NOT NULL,
    "sdi" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Autoscuola_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Autoscuola" ADD CONSTRAINT "Autoscuola_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
