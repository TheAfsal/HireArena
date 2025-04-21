"use strict";
// import { ICandidateResponseRepository } from "../core/interfaces/repository/ICandidateResponseRepository";
// import { ICandidateResponsePartial } from "../core/types/interview.types";
// import CandidateResponseModel, { ICandidateResponse } from "../model/CandidateResponse";
// import BaseRepository from "./base.repository";
// class CandidateResponseRepository 
//   extends BaseRepository<ICandidateResponse, string> 
//   implements ICandidateResponseRepository {
//   constructor() {
//     super(CandidateResponseModel);
//   }
//   async saveCandidateResponse(
//     interviewId: string,
//     questionId: string,
//     selectedAnswer: string,
//     isCorrect: boolean
//   ): Promise<ICandidateResponse> {
//     console.log(selectedAnswer);
//     return this.save({ interviewId, questionId, selectedAnswer, isCorrect });
//   }
//   async getResponsesByInterviewId(interviewId: string): Promise<ICandidateResponsePartial[]> {
//     return this.model
//       .find({ interviewId })
//       .select("questionId selectedAnswer isCorrect")
//       .lean() // Strips Mongoose metadata, returns plain objects
//       .exec() as Promise<ICandidateResponsePartial[]>;
//   }
// }
// export default CandidateResponseRepository;
// import { ICandidateResponse, ICandidateResponsePartial } from "../core/types/interview.types";
// import { ICandidateResponseRepository } from "../core/interfaces/repository/ICandidateResponseRepository";
// import { PrismaClient } from "@prisma/client";
// import BaseRepository from "./base.repository";
// class CandidateResponseRepository 
//   extends BaseRepository<ICandidateResponse, string> 
//   implements ICandidateResponseRepository {
//   constructor(prisma: PrismaClient) {
//     super(prisma);
//     this.setModel();
//   }
//   protected setModel(): void {
//     this.model = this.prisma.candidateResponse;
//   }
//   async saveCandidateResponse(
//     interviewId: string,
//     questionId: string,
//     selectedAnswer: string,
//     isCorrect: boolean
//   ): Promise<ICandidateResponse> {
//     console.log(selectedAnswer);
//     return this.save({
//       interviewId,
//       questionId,
//       selectedAnswer,
//       isCorrect,
//     } as Partial<ICandidateResponse>);
//   }
//   async getResponsesByInterviewId(interviewId: string): Promise<ICandidateResponsePartial[]> {
//     return this.model.findMany({
//       where: { interviewId },
//       select: {
//         questionId: true,
//         selectedAnswer: true,
//         isCorrect: true,
//       },
//     });
//   }
// }
// export default CandidateResponseRepository;
// import { ICandidateResponseRepository } from "../core/interfaces/repository/ICandidateResponseRepository";
// import { ICandidateResponse, ICandidateResponsePartial } from "../core/types/interview.types";
// import { PrismaClient } from "@prisma/client";
// class CandidateResponseRepository implements ICandidateResponseRepository {
//   private prisma: PrismaClient;
//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }
//   async saveCandidateResponse(
//     interviewId: string,
//     questionId: string,
//     selectedAnswer: string,
//     isCorrect: boolean
//   ): Promise<ICandidateResponse> {
//     console.log(selectedAnswer);
//     return this.prisma.candidateResponse.create({
//       data: {
//         interviewId,
//         questionId,
//         selectedAnswer,
//         isCorrect,
//       },
//     });
//   }
//   async getResponsesByInterviewId(interviewId: string): Promise<ICandidateResponsePartial[]> {
//     return this.prisma.candidateResponse.findMany({
//       where: { interviewId },
//       select: {
//         questionId: true,
//         selectedAnswer: true,
//         isCorrect: true,
//       },
//     });
//   }
// }
// export default CandidateResponseRepository;
