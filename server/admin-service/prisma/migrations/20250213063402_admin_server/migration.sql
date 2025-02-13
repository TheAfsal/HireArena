/*
  Warnings:

  - You are about to drop the `CategoryType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobCategoryRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobEmploymentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobSkillRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobRequiredSkills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobCategory" DROP CONSTRAINT "JobCategory_categoryTypeId_fkey";

-- DropForeignKey
ALTER TABLE "JobEmploymentType" DROP CONSTRAINT "JobEmploymentType_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_jobCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategories" DROP CONSTRAINT "_JobCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategories" DROP CONSTRAINT "_JobCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_JobRequiredSkills" DROP CONSTRAINT "_JobRequiredSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobRequiredSkills" DROP CONSTRAINT "_JobRequiredSkills_B_fkey";

-- DropTable
DROP TABLE "CategoryType";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "JobCategory";

-- DropTable
DROP TABLE "JobCategoryRelation";

-- DropTable
DROP TABLE "JobEmploymentType";

-- DropTable
DROP TABLE "JobSkillRelation";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "_JobCategories";

-- DropTable
DROP TABLE "_JobRequiredSkills";

-- DropEnum
DROP TYPE "EmploymentType";

-- DropEnum
DROP TYPE "JobCategories";

-- DropEnum
DROP TYPE "Skills";
