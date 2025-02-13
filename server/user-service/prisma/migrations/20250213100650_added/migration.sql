/*
  Warnings:

  - Added the required column `status` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobSeeker" ADD COLUMN     "status" TEXT NOT NULL;
