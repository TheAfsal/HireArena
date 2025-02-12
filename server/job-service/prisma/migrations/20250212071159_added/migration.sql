/*
  Warnings:

  - Added the required column `status` to the `JobCategory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Skill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `TechStack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobCategory" ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "TechStack" ADD COLUMN     "status" BOOLEAN NOT NULL;
