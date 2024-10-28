-- DropIndex
DROP INDEX "Autoscuole_partIva_key";

-- CreateTable
CREATE TABLE "Tariffe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "prezzo" INTEGER NOT NULL,
    "updateData" DATETIME NOT NULL
);
