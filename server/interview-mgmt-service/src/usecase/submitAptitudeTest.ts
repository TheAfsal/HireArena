import { InterviewRoundRepository } from "../repositories/interviewRound.repository";
import CandidateResponseRepository from "../repositories/candidateResponse.repository";
import InterviewRepository from "../repositories/interview.repository";
import { InterviewStatus, RoundType } from "@prisma/client";

export class SubmitAptitudeTest {
  private interviewRepo: InterviewRepository;
  private responseRepo: CandidateResponseRepository;
  private roundRepo: InterviewRoundRepository;

  constructor(
    interviewRepo: InterviewRepository,
    responseRepo: CandidateResponseRepository,
    roundRepo: InterviewRoundRepository
  ) {
    this.interviewRepo = interviewRepo;
    this.responseRepo = responseRepo;
    this.roundRepo = roundRepo;
  }

  async submit(
    interviewId: string,
    responses: { questionId: string; selectedAnswer: string | null }[]
  ) {
    console.log(responses);
    
    const validResponses = responses.filter(
      response => response.selectedAnswer !== null
    );
    
    const questions = await this.interviewRepo.getQuestionsByInterviewId(
      interviewId
    );
    
    if (!questions || questions.length === 0) {
      throw new Error("No questions found for this interview.");
    }
    
    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = validResponses.length;
    
    const evaluationResults: { questionId: string; isCorrect: boolean }[] = [];
    
    for (const response of validResponses) {
      const question = questions.find((q) => q.id === response.questionId);
      
      if (!question) {
        throw new Error(`Invalid question ID: ${response.questionId}`);
      }
      
      const isCorrect = question.correctAnswer === response.selectedAnswer;
      
      await this.responseRepo.saveCandidateResponse(
        interviewId,
        question.id,
        response.selectedAnswer as string,
        isCorrect
      );
      
      isCorrect ? correctCount++ : incorrectCount++;
      evaluationResults.push({ questionId: question.id, isCorrect });
    }
    
    const unansweredCount = questions.length - attemptedCount;
    
    const totalQuestions = questions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;
    //@ts-ignore
    const passed = scorePercentage >= 70;
    
    const interviewRound = await this.roundRepo.getInterviewRound(
      interviewId,
      RoundType.aptitude
    );
    
    if (!interviewRound) {
      throw new Error("Aptitude test round not found.");
    }
    
    const roundStatus = passed ? "completed" : "failed";
    await this.roundRepo.updateInterviewRoundStatus(
      interviewRound.id,
      roundStatus
    );
    
    if (passed) {
      await this.interviewRepo.progressToNextRound(interviewId);
    } else {
      await this.interviewRepo.updateInterviewStatus(interviewId, InterviewStatus.failed);
    }
    
    return {
      success: true,
      totalQuestions,
      attemptedCount,
      correctCount,
      incorrectCount,
      unansweredCount,
      scorePercentage: parseFloat(scorePercentage.toFixed(2)),
      passed,
      results: evaluationResults,
    };
  }
}


