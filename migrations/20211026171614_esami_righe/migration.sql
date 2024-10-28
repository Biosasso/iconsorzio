/*
  Warnings:

  - Added the required column `TariffeEsamiId` to the `TariffeEsamiRighe` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TariffeEsamiRighe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "TariffeEsamiId" TEXT NOT NULL,
    "codiceEsame" TEXT NOT NULL,
    CONSTRAINT "TariffeEsamiRighe_id_fkey" FOREIGN KEY ("id") REFERENCES "TariffeEsami" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TariffeEsamiRighe" ("codiceEsame", "id") SELECT "codiceEsame", "id" FROM "TariffeEsamiRighe";
DROP TABLE "TariffeEsamiRighe";
ALTER TABLE "new_TariffeEsamiRighe" RENAME TO "TariffeEsamiRighe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
