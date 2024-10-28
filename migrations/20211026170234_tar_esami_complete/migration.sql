/*
  Warnings:

  - Added the required column `localita` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoDom` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoGio` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoLun` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoMar` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoMat` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoMer` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoSab` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prezzoVen` to the `TariffeEsami` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TariffeEsami" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice" TEXT NOT NULL,
    "livello" TEXT NOT NULL,
    "attivo" BOOLEAN NOT NULL,
    "localita" TEXT NOT NULL,
    "prezzoLun" INTEGER NOT NULL,
    "prezzoMar" INTEGER NOT NULL,
    "prezzoMer" INTEGER NOT NULL,
    "prezzoGio" INTEGER NOT NULL,
    "prezzoVen" INTEGER NOT NULL,
    "prezzoSab" INTEGER NOT NULL,
    "prezzoDom" INTEGER NOT NULL,
    "prezzoMat" INTEGER NOT NULL,
    "updateData" DATETIME NOT NULL
);
INSERT INTO "new_TariffeEsami" ("attivo", "codice", "id", "livello", "updateData") SELECT "attivo", "codice", "id", "livello", "updateData" FROM "TariffeEsami";
DROP TABLE "TariffeEsami";
ALTER TABLE "new_TariffeEsami" RENAME TO "TariffeEsami";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
