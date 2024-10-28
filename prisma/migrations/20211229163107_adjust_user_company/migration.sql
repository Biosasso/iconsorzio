/*
  Warnings:

  - You are about to drop the `Companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCompanies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCompanies" DROP CONSTRAINT "UserCompanies_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "UserCompanies" DROP CONSTRAINT "UserCompanies_userId_fkey";

-- DropTable
DROP TABLE "Companies";

-- DropTable
DROP TABLE "UserCompanies";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "vat" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT E'IT',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersCompanies" (
    "id" TEXT NOT NULL,
    "companiesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UsersCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_vat_key" ON "Company"("vat");

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersCompanies" ADD CONSTRAINT "UsersCompanies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
