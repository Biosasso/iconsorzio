-- CreateTable
CREATE TABLE "AlertPrenotazioni" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "limite" INTEGER NOT NULL,

    CONSTRAINT "AlertPrenotazioni_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlertPrenotazioni" ADD CONSTRAINT "AlertPrenotazioni_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
