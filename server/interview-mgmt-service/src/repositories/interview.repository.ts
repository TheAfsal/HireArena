import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import {
  AptitudeTestQuestion,
  InterviewStatus,
  PrismaClient,
  RoundType,
} from "@prisma/client";

class InterviewRepository implements IInterviewRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string> {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      select: { jobId: true },
    });
  
    if (!interview) throw new Error("Interview not found");
  
    const aptitudeTemplate = await this.prisma.aptitudeTestTemplate.findFirst({
      where: { jobId: interview.jobId },
      select: { id: true },
    });
  
    if (!aptitudeTemplate)
      throw new Error("Aptitude test not found for this job");
  
    const attemptedQuestions = await this.prisma.candidateResponse.findFirst({
      where: { interviewId },
    });
  
    if (attemptedQuestions) {
      return "Aptitude test already attempted.";
    }
  
    return this.prisma.aptitudeTestQuestion.findMany({
      where: { templateId: aptitudeTemplate.id },
    });
  }
  

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

  async getQuestionsByInterviewId(interviewId: string) {
    return this.prisma.aptitudeTestQuestion.findMany({
      where: {
        AptitudeTestTemplate: {
          jobId: (
            await this.prisma.interview.findUnique({
              where: { id: interviewId },
            })
          )?.jobId,
        },
      },
    });
  }

  async progressToNextRound(interviewId: string) {
    return this.prisma.interview.update({
      where: { id: interviewId },
      data: { status: InterviewStatus.scheduled },
    });
  }

  async updateInterviewStatus(interviewId: string, status: InterviewStatus) {
    return this.prisma.interview.update({
      where: { id: interviewId },
      data: { status },
    });
  }

  async getTotalAptitudeQuestions(interviewId: string): Promise<number> {
    const questions = await this.prisma.aptitudeTestQuestion.findMany({
      where: {
        AptitudeTestTemplate: {
          jobId: interviewId,
        },
      },
    });

    return questions.length;
  }

  async getInterviewStatusByApplication(jobId: string, userId: string) {
    return this.prisma.interview.findFirst({
      where: { jobId, candidateId: userId },
      select: { id:true, status: true },
    });
  }

  async getInterviewRounds(applicationId: string) {
    return this.prisma.interview.findFirst({
      where: { applicationId },
      select: {
        InterviewRounds: {
          select: { status: true },
        },
      },
    });
  }

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
}

export default InterviewRepository;
