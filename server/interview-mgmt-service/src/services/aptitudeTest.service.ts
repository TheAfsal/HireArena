import InterviewRepository from "@repositories/interview.repository";
import CandidateResponseRepository from "@repositories/candidateResponse.repository";
import { SubmitAptitudeTest } from "../usecase/submitAptitudeTest";
import { InterviewRoundRepository } from "@repositories/interviewRound.repository";

class AptitudeTestService {
  private submitAptitudeTest: SubmitAptitudeTest;
  private responseRepo: CandidateResponseRepository;
  private interviewRepo: InterviewRepository;
  private roundRepo: InterviewRoundRepository;

  constructor(
    submitAptitudeTest: SubmitAptitudeTest,
    responseRepo: CandidateResponseRepository,
    interviewRepo: InterviewRepository,
    roundRepo: InterviewRoundRepository
  ) {
    this.submitAptitudeTest = submitAptitudeTest;
    this.responseRepo = responseRepo;
    this.interviewRepo = interviewRepo;
    this.roundRepo = roundRepo;
  }

  async submitTest(
    interviewId: string,
    data: { questionId: string; selectedAnswer: string }[]
  ) {
    return this.submitAptitudeTest.submit(interviewId, data);
  }

  async getAptitudeResult(interviewId: string) {
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
      "aptitude"
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
