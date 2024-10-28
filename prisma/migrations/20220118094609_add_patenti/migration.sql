-- CreateTable
CREATE TABLE "Patente" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patente" ADD CONSTRAINT "Patente_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
