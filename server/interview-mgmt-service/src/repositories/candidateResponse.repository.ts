import { ICandidateResponseRepository } from "@core/interfaces/repository/ICandidateResponseRepository";
import { ICandidateResponse, ICandidateResponsePartial } from "@core/types/interview.types";
import { PrismaClient } from "@prisma/client";

class CandidateResponseRepository implements ICandidateResponseRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async saveCandidateResponse(
    interviewId: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean
  ): Promise<ICandidateResponse> {
    console.log(selectedAnswer);

    return this.prisma.candidateResponse.create({
      data: {
        interviewId,
        questionId,
        selectedAnswer,
        isCorrect,
      },
    });
  }

  async getResponsesByInterviewId(interviewId: string): Promise<ICandidateResponsePartial[]> {
    return this.prisma.candidateResponse.findMany({
      where: { interviewId },
      select: {
        questionId: true,
        selectedAnswer: true,
        isCorrect: true,
      },
    });
  }
}

export default CandidateResponseRepository;