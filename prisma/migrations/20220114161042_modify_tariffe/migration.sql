/*
  Warnings:

  - You are about to drop the `tariffe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tariffe_esami` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tariffe_esami_righe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tariffe_esami_righe" DROP CONSTRAINT "tariffe_esami_righe_tariffe_esami_id_fkey";

-- DropTable
DROP TABLE "tariffe";

-- DropTable
DROP TABLE "tariffe_esami";

-- DropTable
DROP TABLE "tariffe_esami_righe";

-- CreateTable
CREATE TABLE "TariffaTipo" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tipo_cod" TEXT NOT NULL,

    CONSTRAINT "TariffaTipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tariffa" (
    "id" TEXT NOT NULL,
    "tariffaTipoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "prezzo" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tariffa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TariffaTipo" ADD CONSTRAINT "TariffaTipo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tariffa" ADD CONSTRAINT "Tariffa_tariffaTipoId_fkey" FOREIGN KEY ("tariffaTipoId") REFERENCES "TariffaTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
