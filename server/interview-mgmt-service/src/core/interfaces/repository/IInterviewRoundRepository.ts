import { InterviewRound, RoundStatus, RoundType } from "@prisma/client";

export interface IInterviewRoundRepository {
  getInterviewRound(
    interviewId: string,
    roundType: RoundType
  ): Promise<InterviewRound | null>;

  updateInterviewRoundStatus(
    roundId: string,
    status: RoundStatus
  ): Promise<InterviewRound>;
}

