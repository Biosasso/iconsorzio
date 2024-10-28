/*
  Warnings:

  - You are about to drop the column `TariffeEsamiId` on the `TariffeEsamiRighe` table. All the data in the column will be lost.
  - Added the required column `tariffeEsamiId` to the `TariffeEsamiRighe` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TariffeEsamiRighe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tariffeEsamiId" TEXT NOT NULL,
    "codiceEsame" TEXT NOT NULL,
    CONSTRAINT "TariffeEsamiRighe_tariffeEsamiId_fkey" FOREIGN KEY ("tariffeEsamiId") REFERENCES "TariffeEsami" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TariffeEsamiRighe" ("codiceEsame", "id") SELECT "codiceEsame", "id" FROM "TariffeEsamiRighe";
DROP TABLE "TariffeEsamiRighe";
ALTER TABLE "new_TariffeEsamiRighe" RENAME TO "TariffeEsamiRighe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
