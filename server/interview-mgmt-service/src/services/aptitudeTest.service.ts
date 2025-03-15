import { SubmitAptitudeTest } from "../usecase/submitAptitudeTest";
import { IInterviewRoundRepository } from "@core/interfaces/repository/IInterviewRoundRepository";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import { ICandidateResponseRepository } from "@core/interfaces/repository/ICandidateResponseRepository";
import { RoundStatus, RoundType } from "@prisma/client";
import { IAptitudeTestService } from "@core/interfaces/services/IAptitudeTestService";
import { IAptitudeTestResult } from "@core/types/interview.types";

class AptitudeTestService implements IAptitudeTestService {
  private submitAptitudeTest: SubmitAptitudeTest;
  private responseRepo: ICandidateResponseRepository;
  private interviewRepo: IInterviewRepository;
  private roundRepo: IInterviewRoundRepository;

  constructor(
    submitAptitudeTest: SubmitAptitudeTest,
    responseRepo: ICandidateResponseRepository,
    interviewRepo: IInterviewRepository,
    roundRepo: IInterviewRoundRepository
  ) {
    this.submitAptitudeTest = submitAptitudeTest;
    this.responseRepo = responseRepo;
    this.interviewRepo = interviewRepo;
    this.roundRepo = roundRepo;
  }

  async submitTest(
    interviewId: string,
    data: { questionId: string; selectedAnswer: string }[]
  ): Promise<any> {
    return this.submitAptitudeTest.submit(interviewId, data);
  }

  async getAptitudeResult(interviewId: string): Promise<IAptitudeTestResult> {
    const responses = await this.responseRepo.getResponsesByInterviewId(
      interviewId
    );
    if (!responses.length) {
      throw new Error("No responses found for this interview.");
    }

    const correctCount = responses.filter((r) => r.isCorrect).length;
    const incorrectCount = responses.length - correctCount;
    const totalQuestions = await this.interviewRepo.getTotalAptitudeQuestions(
      interviewId
    );
    const unansweredCount = totalQuestions - responses.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    const interviewRound = await this.roundRepo.getInterviewRound(
      interviewId,
      RoundType.aptitude
    );
    if (!interviewRound) {
      throw new Error("Aptitude test round not found.");
    }

    return {
      interviewId,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      scorePercentage: parseFloat(scorePercentage.toFixed(2)),
      roundStatus: interviewRound.status,
    };
  }
}

export default AptitudeTestService;
