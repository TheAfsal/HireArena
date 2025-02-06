/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyEmployeeRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobSeeker` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('ENGINEERING', 'DESIGN', 'MARKETING', 'HR', 'SALES');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('JAVASCRIPT', 'REACT', 'NODEJS', 'PYTHON', 'JAVA');

-- DropForeignKey
ALTER TABLE "CompanyEmployeeRole" DROP CONSTRAINT "CompanyEmployeeRole_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyEmployeeRole" DROP CONSTRAINT "CompanyEmployeeRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_companyId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "CompanyEmployeeRole";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "JobSeeker";

-- DropEnum
DROP TYPE "CompanyRole";

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "niceToHave" TEXT,
    "benefits" JSONB NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
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
    "category" "JobCategory" NOT NULL,

    CONSTRAINT "JobCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSkillRelation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "skill" "Skill" NOT NULL,

    CONSTRAINT "JobSkillRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobEmploymentType_jobId_type_key" ON "JobEmploymentType"("jobId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategoryRelation_jobId_category_key" ON "JobCategoryRelation"("jobId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "JobSkillRelation_jobId_skill_key" ON "JobSkillRelation"("jobId", "skill");

-- AddForeignKey
ALTER TABLE "JobEmploymentType" ADD CONSTRAINT "JobEmploymentType_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCategoryRelation" ADD CONSTRAINT "JobCategoryRelation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkillRelation" ADD CONSTRAINT "JobSkillRelation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
