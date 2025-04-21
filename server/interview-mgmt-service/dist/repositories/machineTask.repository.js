"use strict";
// import { IMachineTaskRepository } from "../core/interfaces/repository/IMachineTaskRepository";
// import { IMachineTaskDetails, IMachineTaskPartial, IUpdateManyResult } from "../core/types/interview.types";
// import MachineTaskModel, { IMachineTask } from "../model/MachineTask";
// import InterviewModel, { InterviewStatus } from "../model/Interview";
// import BaseRepository from "./base.repository";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MachineTask_1 = __importDefault(require("../model/MachineTask"));
const base_repository_1 = __importDefault(require("./base.repository"));
class MachineTaskRepository extends base_repository_1.default {
    constructor() {
        super(MachineTask_1.default);
    }
    async createMachineTask(machinetask) {
        return await this.save(machinetask);
    }
    async getMachineTaskByJobId(jobId) {
        return this.model
            .findOne({ jobId })
            .select("id title description hoursToComplete")
            .lean()
            .exec();
    }
    async getMachineTaskDetails(taskId) {
        return this.model
            .findById(taskId)
            .populate("requirements")
            .populate("evaluationCriteria")
            .lean()
            .exec();
    }
    async findTaskById(taskId) {
        return this.model.findById(taskId);
    }
    async updateStartTime(taskId, startTime) {
        const updated = await this.model.findByIdAndUpdate(taskId, { startTime });
        if (!updated)
            throw new Error("Task not found");
        return updated;
    }
    async getTaskById(taskId) {
        return this.findById(taskId);
    }
    async updateCandidateTaskStatus(candidateId, jobId, taskId, status) {
        const result = await this.model.updateMany({ candidateId, jobId }, { status });
        return { count: result.modifiedCount };
    }
}
exports.default = MachineTaskRepository;
// import { IMachineTaskRepository } from "../core/interfaces/repository/IMachineTaskRepository";
// import { IMachineTaskDetails, IMachineTaskPartial, IUpdateManyResult } from "../core/types/interview.types";
// import { InterviewStatus, MachineTask, PrismaClient } from "@prisma/client";
// import BaseRepository from "./base.repository";
// class MachineTaskRepository 
//   extends BaseRepository<MachineTask, string> 
//   implements IMachineTaskRepository {
//   constructor(prisma: PrismaClient) {
//     super(prisma);
//     this.setModel();
//   }
//   protected setModel(): void {
//     this.model = this.prisma.machineTask;
//   }
//   async getMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial | null> {
//     return this.prisma.machineTask.findFirst({
//       where: { jobId },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         hoursToComplete: true,
//       },
//     });
//   }
//   async getMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails | null> {
//     return this.prisma.machineTask.findUnique({
//       where: { id: taskId },
//       include: {
//         requirements: true,
//         evaluationCriteria: true,
//       },
//     });
//   }
//   async findTaskById(taskId: string): Promise<MachineTask | null> {
//     return this.findById(taskId); 
//   }
//   async updateStartTime(taskId: string, startTime: Date): Promise<MachineTask> {
//     return this.update(taskId, { startTime }); 
//   }
//   async getTaskById(taskId: string): Promise<MachineTask | null> {
//     return this.findById(taskId); // Reusing base method
//   }
//   async updateCandidateTaskStatus(
//     candidateId: string,
//     taskId: string,
//     status: InterviewStatus
//   ): Promise<IUpdateManyResult> {
//     return this.prisma.interview.updateMany({
//       where: { candidateId, jobId: taskId },
//       data: { status },
//     });
//   }
// }
// export default MachineTaskRepository;
// import { IMachineTaskRepository } from "../core/interfaces/repository/IMachineTaskRepository";
// import { IMachineTaskDetails, IMachineTaskPartial, IUpdateManyResult } from "../core/types/interview.types";
// import { InterviewStatus, MachineTask, PrismaClient } from "@prisma/client";
// class MachineTaskRepository implements IMachineTaskRepository {
//   private prisma: PrismaClient;
//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }
//   async getMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial | null> {
//     return this.prisma.machineTask.findFirst({
//       where: { jobId },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         hoursToComplete: true,
//       },
//     });
//   }
//   async getMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails | null> {
//     return this.prisma.machineTask.findUnique({
//       where: { id: taskId },
//       include: {
//         requirements: true,
//         evaluationCriteria: true,
//       },
//     });
//   }
//   async findTaskById(taskId: string): Promise<MachineTask | null> {
//     return this.prisma.machineTask.findUnique({ where: { id: taskId } });
//   }
//   async updateStartTime(taskId: string, startTime: Date): Promise<MachineTask> {
//     return this.prisma.machineTask.update({
//       where: { id: taskId },
//       data: { startTime },
//     });
//   }
//   async getTaskById(taskId: string): Promise<MachineTask | null> {
//     return this.prisma.machineTask.findUnique({ where: { id: taskId } });
//   }
//   async updateCandidateTaskStatus(
//     candidateId: string,
//     taskId: string,
//     status: InterviewStatus
//   ): Promise<IUpdateManyResult> {
//     return this.prisma.interview.updateMany({
//       where: { candidateId, jobId: taskId },
//       data: { status },
//     });
//   }
// }
// export default MachineTaskRepository;
//   async getInterviewRound(interviewId: string, roundType: RoundType) {
//     return this.prisma.interviewRound.findFirst({
//       where: { interviewId, roundType },
//     });
//   }
//   async updateInterviewRoundStatus(roundId: string, status: RoundStatus) {
//     return this.prisma.interviewRound.update({
//       where: { id: roundId },
//       data: { status },
//     });
//   }
