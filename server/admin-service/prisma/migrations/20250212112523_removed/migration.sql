/*
  Warnings:

  - You are about to drop the column `experienceLevel` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `TechStack` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "experienceLevel";

-- DropTable
DROP TABLE "TechStack";
