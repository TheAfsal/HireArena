// import { IInterviewRoundRepository } from "@core/interfaces/repository/IInterviewRoundRepository";
// import InterviewRoundModel,{ IInterviewRound, RoundStatus, RoundType } from "model/InterviewRound";
// import BaseRepository from "./base.repository";

// export class InterviewRoundRepository 
//   extends BaseRepository<IInterviewRound, string> 
//   implements IInterviewRoundRepository {
  
//   constructor() {
//     super(InterviewRoundModel);
//   }

//   async getInterviewRound(
//     interviewId: string,
//     roundType: RoundType
//   ): Promise<IInterviewRound | null> {
//     return this.model.findOne({ interviewId, roundType }).exec();
//   }

//   async updateInterviewRoundStatus(
//     roundId: string,
//     status: RoundStatus
//   ): Promise<IInterviewRound> {
//     const updated = await this.update(roundId, { status });
//     if (!updated) throw new Error("Round not found");
//     return updated;
//   }
// }

// export default InterviewRoundRepository;










// import { IInterviewRoundRepository } from "@core/interfaces/repository/IInterviewRoundRepository";
// import { PrismaClient, InterviewRound, RoundStatus, RoundType } from "@prisma/client";
// import BaseRepository from "./base.repository";

// export class InterviewRoundRepository 
//   extends BaseRepository<InterviewRound, string> 
//   implements IInterviewRoundRepository {
  
//   constructor(prisma: PrismaClient) {
//     super(prisma);
//     this.setModel();
//   }

//   protected setModel(): void {
//     this.model = this.prisma.interviewRound;
//   }

//   async getInterviewRound(
//     interviewId: string,
//     roundType: RoundType
//   ): Promise<InterviewRound | null> {
//     return this.prisma.interviewRound.findFirst({
//       where: { interviewId, roundType },
//     });
//   }

//   async updateInterviewRoundStatus(
//     roundId: string,
//     status: RoundStatus
//   ): Promise<InterviewRound> {
//     return this.update(roundId, { status });
//   }
// }

// export default InterviewRoundRepository;