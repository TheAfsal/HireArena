/*
  Warnings:

  - You are about to drop the `_JobCategoryToTechStack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JobCategoryToTechStack" DROP CONSTRAINT "_JobCategoryToTechStack_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToTechStack" DROP CONSTRAINT "_JobCategoryToTechStack_B_fkey";

-- DropTable
DROP TABLE "_JobCategoryToTechStack";
