-- DropIndex
DROP INDEX "Transaction_subscriptionId_key";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "subscriptionId" DROP NOT NULL;
