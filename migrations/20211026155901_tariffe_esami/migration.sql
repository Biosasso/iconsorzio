-- CreateTable
CREATE TABLE "TariffeEsami" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice" TEXT NOT NULL,
    "livello" TEXT NOT NULL,
    "attivo" BOOLEAN NOT NULL,
    "updateData" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TariffeEsamiRighe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codiceEsame" TEXT NOT NULL,
    CONSTRAINT "TariffeEsamiRighe_id_fkey" FOREIGN KEY ("id") REFERENCES "TariffeEsami" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
