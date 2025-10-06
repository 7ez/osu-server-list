-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_url_key" ON "Server"("url");
