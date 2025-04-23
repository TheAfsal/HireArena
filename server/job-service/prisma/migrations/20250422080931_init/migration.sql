-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JobCategories" AS ENUM ('ENGINEERING', 'DESIGN', 'MARKETING', 'HR', 'SALES');

-- CreateEnum
CREATE TYPE "Skills" AS ENUM ('JAVASCRIPT', 'REACT', 'NODEJS', 'PYTHON', 'JAVA');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "testOptions" JSONB NOT NULL,
    "niceToHave" TEXT,
    "benefits" JSONB NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resumeUrl" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEmploymentType" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "EmploymentType" NOT NULL,

    CONSTRAINT "JobEmploymentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategoryRelation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "category" "JobCategories" NOT NULL,

    CONSTRAINT "JobCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSkillRelation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "skill" "Skills" NOT NULL,

    CONSTRAINT "JobSkillRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "CategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "categoryTypeId" TEXT NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "jobCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEmploymentType" ADD CONSTRAINT "JobEmploymentType_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCategory" ADD CONSTRAINT "JobCategory_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategories" ADD CONSTRAINT "_JobCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobCategories" ADD CONSTRAINT "_JobCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "JobCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobRequiredSkills" ADD CONSTRAINT "_JobRequiredSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobRequiredSkills" ADD CONSTRAINT "_JobRequiredSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
