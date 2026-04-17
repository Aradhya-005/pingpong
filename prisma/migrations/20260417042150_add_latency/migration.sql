/*
  Warnings:

  - Added the required column `latency` to the `APIResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "APIResults" ADD COLUMN     "latency" INTEGER NOT NULL;
