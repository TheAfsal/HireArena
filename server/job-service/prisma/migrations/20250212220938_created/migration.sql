-- DropForeignKey
ALTER TABLE "JobCategoryRelation" DROP CONSTRAINT "JobCategoryRelation_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobSkillRelation" DROP CONSTRAINT "JobSkillRelation_jobId_fkey";

-- CreateTable
CREATE TABLE "_JobCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobRequiredSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobRequiredSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JobCategories_B_index" ON "_JobCategories"("B");

-- CreateIndex
CREATE INDEX "_JobRequiredSkills_B_index" ON "_JobRequiredSkills"("B");

-- AddForeignKey
ALTER TABLE "_JobCategories" ADD CONSTRAINT "_JobCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategories" ADD CONSTRAINT "_JobCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "JobCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobRequiredSkills" ADD CONSTRAINT "_JobRequiredSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobRequiredSkills" ADD CONSTRAINT "_JobRequiredSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
