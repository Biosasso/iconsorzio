-- CreateTable
CREATE TABLE "Autoscuole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "denominazione" TEXT NOT NULL,
    "consorzioToggle" BOOLEAN NOT NULL,
    "ragSoc" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "nCiv" TEXT NOT NULL,
    "codFisc" TEXT NOT NULL,
    "partIva" TEXT NOT NULL,
    "codMotorizzazione" TEXT NOT NULL,
    "tel1" TEXT NOT NULL,
    "tel2" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pec" TEXT NOT NULL,
    "sdi" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "note" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("access_token", "expires_at", "id", "id_token", "oauth_token", "oauth_token_secret", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "userId") SELECT "access_token", "expires_at", "id", "id_token", "oauth_token", "oauth_token_secret", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("expires", "id", "sessionToken", "userId") SELECT "expires", "id", "sessionToken", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Autoscuole_codFisc_key" ON "Autoscuole"("codFisc");

-- CreateIndex
CREATE UNIQUE INDEX "Autoscuole_partIva_key" ON "Autoscuole"("partIva");
