/*
  Warnings:

  - The primary key for the `CategoryType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `JobCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_JobCategoryToSkill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_JobCategoryToTechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_SkillToTechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "JobCategory" DROP CONSTRAINT "JobCategory_categoryTypeId_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToSkill" DROP CONSTRAINT "_JobCategoryToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToSkill" DROP CONSTRAINT "_JobCategoryToSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToTechStack" DROP CONSTRAINT "_JobCategoryToTechStack_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobCategoryToTechStack" DROP CONSTRAINT "_JobCategoryToTechStack_B_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToTechStack" DROP CONSTRAINT "_SkillToTechStack_A_fkey";

-- DropForeignKey
ALTER TABLE "_SkillToTechStack" DROP CONSTRAINT "_SkillToTechStack_B_fkey";

-- AlterTable
ALTER TABLE "CategoryType" DROP CONSTRAINT "CategoryType_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CategoryType_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CategoryType_id_seq";

-- AlterTable
ALTER TABLE "JobCategory" DROP CONSTRAINT "JobCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryTypeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "JobCategory_id_seq";

-- AlterTable
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Skill_id_seq";

-- AlterTable
ALTER TABLE "TechStack" DROP CONSTRAINT "TechStack_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TechStack_id_seq";

-- AlterTable
ALTER TABLE "_JobCategoryToSkill" DROP CONSTRAINT "_JobCategoryToSkill_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_JobCategoryToSkill_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_JobCategoryToTechStack" DROP CONSTRAINT "_JobCategoryToTechStack_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_JobCategoryToTechStack_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_SkillToTechStack" DROP CONSTRAINT "_SkillToTechStack_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_SkillToTechStack_AB_pkey" PRIMARY KEY ("A", "B");

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
