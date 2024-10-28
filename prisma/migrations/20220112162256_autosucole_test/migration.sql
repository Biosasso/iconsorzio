-- AlterTable
ALTER TABLE "autoscuole" ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "autoscuole" ADD CONSTRAINT "autoscuole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
