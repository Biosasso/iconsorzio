-- CreateTable
CREATE TABLE "ActiveCompany" (
    "id" TEXT NOT NULL,
    "isActive" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ActiveCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCompany_userId_key" ON "ActiveCompany"("userId");

-- AddForeignKey
ALTER TABLE "ActiveCompany" ADD CONSTRAINT "ActiveCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
