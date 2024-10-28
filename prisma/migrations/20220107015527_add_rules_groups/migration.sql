-- CreateTable
CREATE TABLE "RulesGroup" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "usersRulesGroupId" TEXT,

    CONSTRAINT "RulesGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersRulesGroup" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "rulesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "UsersRulesGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RulesGroup" ADD CONSTRAINT "RulesGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesGroup" ADD CONSTRAINT "RulesGroup_usersRulesGroupId_fkey" FOREIGN KEY ("usersRulesGroupId") REFERENCES "UsersRulesGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersRulesGroup" ADD CONSTRAINT "UsersRulesGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
