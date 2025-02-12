/*
  Warnings:

  - Changed the type of `category` on the `JobCategoryRelation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skill` on the `JobSkillRelation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobCategories" AS ENUM ('ENGINEERING', 'DESIGN', 'MARKETING', 'HR', 'SALES');

-- CreateEnum
CREATE TYPE "Skills" AS ENUM ('JAVASCRIPT', 'REACT', 'NODEJS', 'PYTHON', 'JAVA');

-- DropIndex
DROP INDEX "JobCategoryRelation_jobId_category_key";

-- DropIndex
DROP INDEX "JobEmploymentType_jobId_type_key";

-- DropIndex
DROP INDEX "JobSkillRelation_jobId_skill_key";

-- AlterTable
ALTER TABLE "JobCategoryRelation" DROP COLUMN "category",
ADD COLUMN     "category" "JobCategories" NOT NULL;

-- AlterTable
ALTER TABLE "JobSkillRelation" DROP COLUMN "skill",
ADD COLUMN     "skill" "Skills" NOT NULL;

-- DropEnum
DROP TYPE "JobCategory";

-- DropEnum
DROP TYPE "Skill";

-- CreateTable
CREATE TABLE "CategoryType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "CategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryTypeId" INTEGER NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobCategoryToTechStack" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobCategoryToTechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobCategoryToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobCategoryToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SkillToTechStack" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SkillToTechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JobCategoryToTechStack_B_index" ON "_JobCategoryToTechStack"("B");

-- CreateIndex
CREATE INDEX "_JobCategoryToSkill_B_index" ON "_JobCategoryToSkill"("B");

-- CreateIndex
CREATE INDEX "_SkillToTechStack_B_index" ON "_SkillToTechStack"("B");

-- AddForeignKey
ALTER TABLE "JobCategory" ADD CONSTRAINT "JobCategory_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategoryToTechStack" ADD CONSTRAINT "_JobCategoryToTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "JobCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategoryToTechStack" ADD CONSTRAINT "_JobCategoryToTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategoryToSkill" ADD CONSTRAINT "_JobCategoryToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "JobCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategoryToSkill" ADD CONSTRAINT "_JobCategoryToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToTechStack" ADD CONSTRAINT "_SkillToTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToTechStack" ADD CONSTRAINT "_SkillToTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
