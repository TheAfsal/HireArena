/*
  Warnings:

  - You are about to drop the `_JobCategoryToSkill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobCategoryId` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_JobCategoryToSkill" DROP CONSTRAINT "_JobCategoryToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToSkill" DROP CONSTRAINT "_JobCategoryToSkill_B_fkey";

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "jobCategoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_JobCategoryToSkill";

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
