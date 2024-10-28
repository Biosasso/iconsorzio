-- CreateTable
CREATE TABLE "Workplace" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Workplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veicolo" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "targa" TEXT NOT NULL,
    "modello" TEXT NOT NULL,
    "immatricolazione" TIMESTAMP(3) NOT NULL,
    "scadenzaRevisione" TIMESTAMP(3) NOT NULL,
    "scadenzaAssicurazione" TIMESTAMP(3) NOT NULL,
    "scadenzaBollo" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "workplaceId" TEXT NOT NULL,

    CONSTRAINT "Veicolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatentiOnVeicoli" (
    "companyId" TEXT NOT NULL,
    "patenteId" TEXT NOT NULL,
    "veicoloId" TEXT NOT NULL,

    CONSTRAINT "PatentiOnVeicoli_pkey" PRIMARY KEY ("companyId","patenteId","veicoloId")
);

-- AddForeignKey
ALTER TABLE "Workplace" ADD CONSTRAINT "Workplace_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veicolo" ADD CONSTRAINT "Veicolo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veicolo" ADD CONSTRAINT "Veicolo_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatentiOnVeicoli" ADD CONSTRAINT "PatentiOnVeicoli_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatentiOnVeicoli" ADD CONSTRAINT "PatentiOnVeicoli_patenteId_fkey" FOREIGN KEY ("patenteId") REFERENCES "Patente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatentiOnVeicoli" ADD CONSTRAINT "PatentiOnVeicoli_veicoloId_fkey" FOREIGN KEY ("veicoloId") REFERENCES "Veicolo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
