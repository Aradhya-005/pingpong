-- CreateTable
CREATE TABLE "APIResults" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "APIResults_pkey" PRIMARY KEY ("id")
);
