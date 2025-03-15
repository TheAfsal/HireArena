import { IInterviewRoundRepository } from "@core/interfaces/repository/IInterviewRoundRepository";
import { PrismaClient, InterviewRound, RoundStatus, RoundType } from "@prisma/client";

export class InterviewRoundRepository implements IInterviewRoundRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getInterviewRound(
    interviewId: string,
    roundType: RoundType
  ): Promise<InterviewRound | null> {
    return this.prisma.interviewRound.findFirst({
      where: { interviewId, roundType },
    });
  }

  async updateInterviewRoundStatus(
    roundId: string,
    status: RoundStatus
  ): Promise<InterviewRound> {
    return this.prisma.interviewRound.update({
      where: { id: roundId },
      data: { status },
    });
  }
}

export default InterviewRoundRepository;