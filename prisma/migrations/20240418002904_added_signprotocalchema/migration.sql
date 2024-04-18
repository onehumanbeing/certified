-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_schemas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schemaId" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_schemas_userId_key" ON "user_schemas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_schemas_schemaId_key" ON "user_schemas"("schemaId");

-- AddForeignKey
ALTER TABLE "user_schemas" ADD CONSTRAINT "user_schemas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
