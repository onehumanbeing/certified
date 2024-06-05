-- CreateTable
CREATE TABLE "ApiKeyTable" (
    "id" SERIAL NOT NULL,
    "apiKey" TEXT NOT NULL,

    CONSTRAINT "ApiKeyTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeyTable_apiKey_key" ON "ApiKeyTable"("apiKey");
