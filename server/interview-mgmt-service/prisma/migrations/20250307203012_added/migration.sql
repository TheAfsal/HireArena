-- CreateTable
CREATE TABLE "MachineTask" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hoursToComplete" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MachineTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineTaskRequirement" (
    "id" TEXT NOT NULL,
    "machineTaskId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,

    CONSTRAINT "MachineTaskRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineTaskEvaluation" (
    "id" TEXT NOT NULL,
    "machineTaskId" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,

    CONSTRAINT "MachineTaskEvaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MachineTaskRequirement" ADD CONSTRAINT "MachineTaskRequirement_machineTaskId_fkey" FOREIGN KEY ("machineTaskId") REFERENCES "MachineTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineTaskEvaluation" ADD CONSTRAINT "MachineTaskEvaluation_machineTaskId_fkey" FOREIGN KEY ("machineTaskId") REFERENCES "MachineTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
