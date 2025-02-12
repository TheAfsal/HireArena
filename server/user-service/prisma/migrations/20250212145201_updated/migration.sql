/*
  Warnings:

  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_name_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
ADD COLUMN     "aboutCompany" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "employeeCount" TEXT,
ADD COLUMN     "foundingDay" TEXT,
ADD COLUMN     "foundingMonth" TEXT,
ADD COLUMN     "foundingYear" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "jobCategories" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "website" TEXT;
