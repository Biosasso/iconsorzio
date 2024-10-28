-- CreateTable
CREATE TABLE "Allievo" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "autoscuolaId" TEXT NOT NULL,
    "iscrizioneNumero" TEXT,
    "iscrizioneData" TIMESTAMP(3),
    "codiceMeccanografico" TEXT,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "nascitaLuogo" TEXT NOT NULL,
    "nascitaData" TIMESTAMP(3) NOT NULL,
    "genere" TEXT NOT NULL,
    "codFisc" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "cap" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Allievo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllievoIstruzione" (
    "companyId" TEXT NOT NULL,
    "patenteId" TEXT NOT NULL,
    "allievoId" TEXT NOT NULL,
    "marcaOperativa" TEXT NOT NULL,
    "dataEsame" TEXT,
    "foglioRosaRilascio" TIMESTAMP(3),
    "foglioRosaScadenza" TIMESTAMP(3),
    "codiceStatino" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllievoIstruzione_pkey" PRIMARY KEY ("companyId","patenteId","allievoId","marcaOperativa")
);

-- CreateTable
CREATE TABLE "AllievoServizio" (
    "companyId" TEXT NOT NULL,
    "allievoId" TEXT NOT NULL,
    "patenteId" TEXT NOT NULL,
    "marcaOperativaId" TEXT NOT NULL,
    "dataServizio" TIMESTAMP(3) NOT NULL,
    "tariffaId" TEXT NOT NULL,
    "durataMinuti" INTEGER,
    "istruttoreId" TEXT,
    "esaminatoreId" TEXT,
    "insegnanteId" TEXT,
    "esito" TEXT,

    CONSTRAINT "AllievoServizio_pkey" PRIMARY KEY ("companyId","allievoId","patenteId","marcaOperativaId","dataServizio")
);

-- AddForeignKey
ALTER TABLE "Allievo" ADD CONSTRAINT "Allievo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allievo" ADD CONSTRAINT "Allievo_autoscuolaId_fkey" FOREIGN KEY ("autoscuolaId") REFERENCES "Autoscuola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoIstruzione" ADD CONSTRAINT "AllievoIstruzione_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoIstruzione" ADD CONSTRAINT "AllievoIstruzione_patenteId_fkey" FOREIGN KEY ("patenteId") REFERENCES "Patente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoIstruzione" ADD CONSTRAINT "AllievoIstruzione_allievoId_fkey" FOREIGN KEY ("allievoId") REFERENCES "Allievo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_companyId_allievoId_patenteId_marcaOperati_fkey" FOREIGN KEY ("companyId", "allievoId", "patenteId", "marcaOperativaId") REFERENCES "AllievoIstruzione"("companyId", "patenteId", "allievoId", "marcaOperativa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_tariffaId_fkey" FOREIGN KEY ("tariffaId") REFERENCES "Tariffa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_istruttoreId_fkey" FOREIGN KEY ("istruttoreId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_esaminatoreId_fkey" FOREIGN KEY ("esaminatoreId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllievoServizio" ADD CONSTRAINT "AllievoServizio_insegnanteId_fkey" FOREIGN KEY ("insegnanteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
