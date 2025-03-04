/*
  Warnings:

  - Added the required column `status` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;
