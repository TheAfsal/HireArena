import { IInterviewRoundRepository } from "@core/interfaces/repository/IInterviewRoundRepository";
import { PrismaClient, RoundStatus, RoundType } from "@prisma/client";

export class InterviewRoundRepository implements IInterviewRoundRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getInterviewRound(interviewId: string, roundType: RoundType) {
    return this.prisma.interviewRound.findFirst({
      where: { interviewId, roundType },
    });
  }

  async updateInterviewRoundStatus(roundId: string, status: RoundStatus) {
    return this.prisma.interviewRound.update({
      where: { id: roundId },
      data: { status },
    });
  }

}
