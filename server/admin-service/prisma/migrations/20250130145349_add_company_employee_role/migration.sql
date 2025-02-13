/*
  Warnings:

  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `JobSeeker` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('OWNER', 'HR', 'MANAGER', 'INTERVIEWER', 'EMPLOYEE');

-- DropIndex
DROP INDEX "Company_email_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "JobSeeker" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyEmployeeRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyEmployeeRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyEmployeeRole_userId_companyId_key" ON "CompanyEmployeeRole"("userId", "companyId");

-- AddForeignKey
ALTER TABLE "CompanyEmployeeRole" ADD CONSTRAINT "CompanyEmployeeRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEmployeeRole" ADD CONSTRAINT "CompanyEmployeeRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
