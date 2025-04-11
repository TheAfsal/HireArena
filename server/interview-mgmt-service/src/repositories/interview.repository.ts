import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import InterviewModel, { IInterview, IRoundStatus } from "model/Interview";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
class InterviewRepository
  extends BaseRepository<IInterview, string>
  implements IInterviewRepository
{
  constructor(interviewModel: Model<IInterview> = InterviewModel) {
    super(interviewModel);
  }

  async findApplicationById(interviewId: string): Promise<IInterview | null> {
    return this.model.findOne({ _id: interviewId }).exec();
  }

  async findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<IInterview | null> {
    return this.model.findOne({ jobId, candidateId: jobSeekerId }).exec();
  }

  async createApplication(
    jobDetails: Partial<IInterview>
  ): Promise<IInterview> {
    return await this.save(jobDetails);
  }

  async updateAptitudeTestById(
    interviewId: string,
    state: IRoundStatus
  ): Promise<void> {
    this.model
      .findByIdAndUpdate(
        interviewId,
        { $set: { "state.0": state } },
      )
      .exec();
  }

  // async getAptitudeQuestions(interviewId: string): Promise<IAptitudeTestQuestion[] | string> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const aptitudeTemplate = await AptitudeTestTemplateModel.findOne({ jobId: interview.jobId }).exec();
  //   if (!aptitudeTemplate) throw new Error("Aptitude test not found for this job");

  //   const attemptedQuestions = await CandidateResponseModel.findOne({ interviewId }).exec();
  //   if (attemptedQuestions) return "Aptitude test already attempted.";

  //   return AptitudeTestQuestionModel.find({ templateId: aptitudeTemplate._id }).exec();
  // }

  // async getQuestionsByInterviewId(interviewId: string): Promise<IAptitudeTestQuestion[]> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const templates = await AptitudeTestTemplateModel.find({ jobId: interview.jobId }).exec();
  //   const templateIds = templates.map(t => t._id);
  //   return AptitudeTestQuestionModel.find({ templateId: { $in: templateIds } }).exec();
  // }

  // async progressToNextRound(interviewId: string): Promise<IInterview> {
  //   const updated = await this.update(interviewId, { status: InterviewStatus.Scheduled });
  //   if (!updated) throw new Error("Interview not found");
  //   return updated;
  // }

  // async updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<IInterview> {
  //   const updated = await this.update(interviewId, { status });
  //   if (!updated) throw new Error("Interview not found");
  //   return updated;
  // }

  // async getTotalAptitudeQuestions(interviewId: string): Promise<number> {
  //   const interview = await this.findById(interviewId);
  //   if (!interview) throw new Error("Interview not found");

  //   const templates = await AptitudeTestTemplateModel.find({ jobId: interview.jobId }).exec();
  //   const templateIds = templates.map(t => t._id);
  //   const questions = await AptitudeTestQuestionModel.find({ templateId: { $in: templateIds } }).exec();
  //   return questions.length;
  // }

  // async getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null> {
  //   const interview = await this.model
  //     .findOne({ jobId, candidateId: userId })
  //     .select("id status")
  //     .exec();
  //   return interview ? { id: interview.id, status: interview.status } : null;
  // }

  // async getInterviewRounds(applicationId: string): Promise<any | null> {
  //   const interview = await this.model
  //     .findOne({ applicationId })
  //     .populate("InterviewRounds", "status")
  //     .exec();
  //   return interview ? { InterviewRounds: (interview as any).InterviewRounds } : null;
  // }
}

export default InterviewRepository;

// import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
// import { IInterviewRounds, IInterviewStatus } from "@core/types/interview.types";
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
