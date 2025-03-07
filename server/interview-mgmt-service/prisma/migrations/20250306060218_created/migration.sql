/*
  Warnings:

  - You are about to drop the column `interviewerId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InterviewRound` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "RoundType" ADD VALUE 'machine_task';

-- DropIndex
DROP INDEX "Interview_candidateId_idx";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "interviewerId",
DROP COLUMN "updatedAt",
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "scheduledAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InterviewRound" DROP COLUMN "updatedAt",
ADD COLUMN     "score" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'pending';
