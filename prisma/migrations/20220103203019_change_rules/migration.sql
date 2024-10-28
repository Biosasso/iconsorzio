-- DropForeignKey
ALTER TABLE "UserRules" DROP CONSTRAINT "UserRules_userId_fkey";

-- AlterTable
ALTER TABLE "UserRules" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsersCompanies" ALTER COLUMN "isActive" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "UserRules" ADD CONSTRAINT "UserRules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersCompanies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
