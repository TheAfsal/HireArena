/*
  Warnings:

  - You are about to drop the column `password` on the `Company` table. All the data in the column will be lost.
  - Added the required column `password` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "JobSeeker" ADD COLUMN     "password" TEXT NOT NULL;
