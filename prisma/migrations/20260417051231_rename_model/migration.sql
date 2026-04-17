/*
  Warnings:

  - You are about to drop the `APIResults` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "APIResults";

-- CreateTable
CREATE TABLE "ApiResult" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "latency" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiResult_pkey" PRIMARY KEY ("id")
);
