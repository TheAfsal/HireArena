/*
  Warnings:

  - You are about to drop the column `name` on the `JobSeeker` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobSeeker" DROP COLUMN "name",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "phone" TEXT;
