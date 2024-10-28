-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TariffeEsamiRighe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "TariffeEsamiId" TEXT NOT NULL,
    "codiceEsame" TEXT NOT NULL,
    CONSTRAINT "TariffeEsamiRighe_TariffeEsamiId_fkey" FOREIGN KEY ("TariffeEsamiId") REFERENCES "TariffeEsami" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TariffeEsamiRighe" ("TariffeEsamiId", "codiceEsame", "id") SELECT "TariffeEsamiId", "codiceEsame", "id" FROM "TariffeEsamiRighe";
DROP TABLE "TariffeEsamiRighe";
ALTER TABLE "new_TariffeEsamiRighe" RENAME TO "TariffeEsamiRighe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
