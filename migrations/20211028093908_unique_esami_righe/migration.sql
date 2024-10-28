/*
  Warnings:

  - A unique constraint covering the columns `[tariffeEsamiId,codiceEsame]` on the table `TariffeEsamiRighe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TariffeEsamiRighe_tariffeEsamiId_codiceEsame_key" ON "TariffeEsamiRighe"("tariffeEsamiId", "codiceEsame");
