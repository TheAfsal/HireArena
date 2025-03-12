import { RoundStatus, RoundType } from "@prisma/client";

export interface IInterviewRoundRepository {
  getInterviewRound(interviewId: string, roundType: RoundType): Promise<any>;
  updateInterviewRoundStatus(roundId: string, status: RoundStatus): Promise<any>;
}

