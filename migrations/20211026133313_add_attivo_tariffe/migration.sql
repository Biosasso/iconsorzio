/*
  Warnings:

  - Added the required column `attivo` to the `Tariffe` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tariffe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "prezzo" INTEGER NOT NULL,
    "attivo" BOOLEAN NOT NULL,
    "updateData" DATETIME NOT NULL
);
INSERT INTO "new_Tariffe" ("codice", "descrizione", "id", "prezzo", "updateData") SELECT "codice", "descrizione", "id", "prezzo", "updateData" FROM "Tariffe";
DROP TABLE "Tariffe";
ALTER TABLE "new_Tariffe" RENAME TO "Tariffe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
