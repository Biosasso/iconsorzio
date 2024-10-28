-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "autoscuole" (
    "id" TEXT NOT NULL,
    "denominazione" TEXT NOT NULL,
    "consorzio_toggle" BOOLEAN NOT NULL,
    "rag_soc" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "n_civ" TEXT NOT NULL,
    "cod_fisc" TEXT NOT NULL,
    "part_iva" TEXT NOT NULL,
    "cod_motorizzazione" TEXT NOT NULL,
    "tel_1" TEXT NOT NULL,
    "tel_2" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pec" TEXT NOT NULL,
    "sdi" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "autoscuole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffe" (
    "id" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "prezzo" INTEGER NOT NULL,
    "attivo" BOOLEAN NOT NULL,
    "update_data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariffe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffe_esami" (
    "id" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "livello" TEXT NOT NULL,
    "attivo" BOOLEAN NOT NULL,
    "localita" TEXT NOT NULL,
    "prezzo_lun" INTEGER NOT NULL,
    "prezzo_mar" INTEGER NOT NULL,
    "prezzo_mer" INTEGER NOT NULL,
    "prezzo_gio" INTEGER NOT NULL,
    "prezzo_ven" INTEGER NOT NULL,
    "prezzo_sab" INTEGER NOT NULL,
    "prezzo_dom" INTEGER NOT NULL,
    "prezzo_mat" INTEGER NOT NULL,
    "update_data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariffe_esami_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffe_esami_righe" (
    "id" TEXT NOT NULL,
    "tariffe_esami_id" TEXT NOT NULL,
    "codice_esame" TEXT NOT NULL,

    CONSTRAINT "tariffe_esami_righe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_key" ON "account"("provider", "provider_account");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "autoscuole_cod_fisc_key" ON "autoscuole"("cod_fisc");

-- CreateIndex
CREATE UNIQUE INDEX "tariffe_esami_righe_tariffe_esami_id_codice_esame_key" ON "tariffe_esami_righe"("tariffe_esami_id", "codice_esame");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffe_esami_righe" ADD CONSTRAINT "tariffe_esami_righe_tariffe_esami_id_fkey" FOREIGN KEY ("tariffe_esami_id") REFERENCES "tariffe_esami"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
