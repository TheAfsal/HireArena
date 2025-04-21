"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const Interview_1 = __importStar(require("../model/Interview"));
class InterviewRepository extends base_repository_1.default {
    constructor(interviewModel = Interview_1.default) {
        super(interviewModel);
    }
    async findApplicationById(interviewId) {
        return this.model.findOne({ _id: interviewId }).exec();
    }
    async findApplication(jobId, jobSeekerId) {
        return this.model.findOne({ jobId, candidateId: jobSeekerId }).exec();
    }
    async findApplicationByCandidateId(candidateId) {
        return this.model.find({ candidateId }).exec();
    }
    async createApplication(jobDetails) {
        return await this.save(jobDetails);
    }
    async updateAptitudeTestById(interviewId, state) {
        this.model
            .findByIdAndUpdate(interviewId, { $set: { "state.0": state } })
            .exec();
    }
    async addAptitudeTestId(interviewId, testResultId, completed) {
        const update = {
            "state.0.aptitudeTestResultId": testResultId,
        };
        if (completed) {
            update["state.0.status"] = Interview_1.RoundStatus.Completed;
        }
        await this.model
            .findByIdAndUpdate(interviewId, {
            $set: update,
        })
            .exec();
    }
    async addNextTest(interviewId, newTest) {
        this.model
            .findByIdAndUpdate(interviewId, {
            $push: { state: newTest },
        }, { new: true })
            .exec();
    }
    async findApplicationByJobId(jobs) {
        return this.model
            .find({ jobId: { $in: jobs } })
            .sort({ createdAt: -1 })
            .exec();
    }
    async addInterviewRound(interviewId, roundData) {
        // Step 1: Fetch the document to get the state array length
        const interview = await this.model.findById(interviewId).exec();
        if (!interview || !interview.state.length) {
            throw new Error("Interview not found or state array is empty");
        }
        // Step 2: Update the last element using the specific index
        const lastIndex = interview.state.length - 1;
        const updateResult = await this.model
            .findByIdAndUpdate(interviewId, { $set: { [`state.${lastIndex}`]: roundData } }, { new: true })
            .exec();
        console.log("Updated document:", updateResult);
        return updateResult;
    }
    async submitVideoInterview(interviewId, candidateId, roundData) {
        const interview = await this.model
            .findOne({ _id: interviewId, candidateId })
            .exec();
        if (!interview || !interview.state.length) {
            throw new Error("Interview not found or state array is empty");
        }
        const lastIndex = interview.state.length - 1;
        return this.model
            .findOneAndUpdate({ _id: interviewId, candidateId }, {
            $set: {
                [`state.${lastIndex}`]: roundData,
                updatedAt: new Date(),
            },
        }, { new: true })
            .exec();
    }
    async updateMachineTaskStatus(candidateId, jobId, taskId, status) {
        const interview = await this.model
            .findOne({ jobId, candidateId })
            .exec();
        if (!interview || !interview.state.length) {
            throw new Error("Interview not found or state array is empty");
        }
        const lastIndex = interview.state.length - 1;
        return await this.model.findOneAndUpdate({ candidateId, jobId }, {
            $set: {
                [`state.${lastIndex}.status`]: status,
                updatedAt: new Date(),
            },
        }, { new: true });
    }
}
exports.default = InterviewRepository;
// import { IInterviewRepository } from "../core/interfaces/repository/IInterviewRepository";
// import { IInterviewRounds, IInterviewStatus } from "../core/types/interview.types";
// import { AptitudeTestQuestion, Interview, InterviewStatus, PrismaClient } from "@prisma/client";
// import BaseRepository from "./base.repository";
// class InterviewRepository
//   extends BaseRepository<Interview, string>
//   implements IInterviewRepository {
//   constructor(prisma: PrismaClient) {
//     super(prisma);
//     this.setModel();
//   }
//   protected setModel(): void {
//     this.model = this.prisma.interview;
//   }
//   async getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string> {
//     const interview = await this.findById(interviewId);
//     if (!interview) throw new Error("Interview not found");
//     const aptitudeTemplate = await this.prisma.aptitudeTestTemplate.findFirst({
//       where: { jobId: interview.jobId },
//       select: { id: true },
//     });
//     if (!aptitudeTemplate)
//       throw new Error("Aptitude test not found for this job");
//     const attemptedQuestions = await this.prisma.candidateResponse.findFirst({
//       where: { interviewId },
//     });
//     if (attemptedQuestions) {
//       return "Aptitude test already attempted.";
//     }
//     return this.prisma.aptitudeTestQuestion.findMany({
//       where: { templateId: aptitudeTemplate.id },
//     });
//   }
//   async getQuestionsByInterviewId(interviewId: string): Promise<AptitudeTestQuestion[]> {
//     const interview = await this.findById(interviewId);
//     return this.prisma.aptitudeTestQuestion.findMany({
//       where: {
//         AptitudeTestTemplate: {
//           jobId: interview?.jobId,
//         },
//       },
//     });
//   }
//   async progressToNextRound(interviewId: string): Promise<Interview> {
//     return this.update(interviewId, { status: InterviewStatus.scheduled });
//   }
//   async updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<Interview> {
//     return this.update(interviewId, { status });
//   }
//   async getTotalAptitudeQuestions(interviewId: string): Promise<number> {
//     const questions = await this.prisma.aptitudeTestQuestion.findMany({
//       where: {
//         AptitudeTestTemplate: {
//           jobId: interviewId,
//         },
//       },
//     });
//     return questions.length;
//   }
//   async getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null> {
//     return this.prisma.interview.findFirst({
//       where: { jobId, candidateId: userId },
//       select: { id: true, status: true },
//     });
//   }
//   async getInterviewRounds(applicationId: string): Promise<IInterviewRounds | null> {
//     return this.prisma.interview.findFirst({
//       where: { applicationId },
//       select: {
//         InterviewRounds: {
//           select: { status: true },
//         },
//       },
//     });
//   }
// }
// export default InterviewRepository;
// async getAptitudeQuestions(
//   interviewId: string
// ): Promise<AptitudeTestQuestion[]> {
//   const interview = await this.prisma.interview.findUnique({
//     where: { id: interviewId },
//     select: { jobId: true },
//   });
//   if (!interview) throw new Error("Interview not found");
//   const aptitudeTemplate = await this.prisma.aptitudeTestTemplate.findFirst({
//     where: { jobId: interview.jobId },
//     select: { id: true },
//   });
//   if (!aptitudeTemplate)
//     throw new Error("Aptitude test not found for this job");
//   return this.prisma.aptitudeTestQuestion.findMany({
//     where: { templateId: aptitudeTemplate.id },
//   });
// }
// getInterview = async (interviewId) => {
//   return this.prisma.interview.findUnique({
//     where: { id: interviewId },
//     include: { InterviewRounds: true },
//   });
// };
// async createInterview(applicationId: string, candidateId: string): Promise<Interview> {
// return this.prisma.interview.create({
//   data: {
//     applicationId,
//     candidateId,
//     status: InterviewStatus.pending,
//     scheduledAt: new Date(),
//   },
// });
// }
// async addAptitudeRound(interviewId: string) {
//   return this.prisma.interviewRound.create({
//     data: {
//       interviewId,
//       roundType: RoundType.aptitude,
//       status: RoundStatus.pending,
//       scheduledAt: new Date(),
//     },
//   });
// }
// async getInterviewByCandidate(candidateId: string) {
//   return this.prisma.interview.findFirst({
//     where: { candidateId },
//     include: { InterviewRounds: true },
//   });
// }
