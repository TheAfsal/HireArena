import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import IQuestionRepository from "@core/interfaces/repository/IQuestionRepository";
import { IAptitudeTestResult } from "model/AptitudeTestResult";
import { RoundStatus } from "model/Interview";

class SubmitTest {
  constructor(
    private questionsRepo: IQuestionRepository,
    private interviewRepo: IInterviewRepository
  ) {}

  async submitAptitudeTest(
    interviewId: string,
    jobId: string,
    responses: { questionId: string; selectedAnswer: string | null }[]
  ):Promise<Partial<IAptitudeTestResult>> {
    console.log(responses);

    const validResponses = responses.filter(
      (response) => response.selectedAnswer !== null
    );

    const questions = await this.questionsRepo.getQuestions(jobId);

    if (!questions || questions.aptitudeQuestions.length === 0) {
      throw new Error("No questions found for this interview.");
    }

    console.log("@@ questions", questions);
    console.log("@@ questions length", questions.aptitudeQuestions.length);
    console.log("@@ responses", responses);

    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = validResponses.length;

    const evaluationResults: { questionId: string; isCorrect: boolean }[] = [];

    for (const response of validResponses) {
      const question = questions.aptitudeQuestions.find(
        (q) => q.q_id === response.questionId
      );

      if (!question) {
        throw new Error(`Invalid question ID: ${response.questionId}`);
      }

      const isCorrect = question.correctAnswer === response.selectedAnswer;

      // await this.responseRepo.saveCandidateResponse(
      //   interviewId,
      //   question.id,
      //   response.selectedAnswer as string,
      //   isCorrect
      // );

      isCorrect ? correctCount++ : incorrectCount++;
      evaluationResults.push({ questionId: question.q_id, isCorrect });
    }

    const unansweredCount = questions.aptitudeQuestions.length - attemptedCount;

    const totalQuestions = questions.aptitudeQuestions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;
    //@ts-ignore
    const passed = scorePercentage >= 70;

    // const interviewRound = await this.roundRepo.getInterviewRound(
    //   interviewId,
    //   RoundType.aptitude
    // );

    // if (!interviewRound) {
    //   throw new Error("Aptitude test round not found.");
    // }

    // const roundStatus = passed ? "completed" : "failed";
    // await this.roundRepo.updateInterviewRoundStatus(
    //   interviewRound.id,
    //   roundStatus
    // );

    // if (passed) {
    //   await this.interviewRepo.progressToNextRound(interviewId);
    // } else {
    //   await this.interviewRepo.updateInterviewStatus(
    //     interviewId,
    //     InterviewStatus.failed
    //   );
    // }

    // return {
    //   success: true,
    //   totalQuestions,
    //   attemptedCount,
    //   correctCount,
    //   incorrectCount,
    //   unansweredCount,
    //   scorePercentage: parseFloat(scorePercentage.toFixed(2)),
    //   passed,
    //   results: evaluationResults,
    // };
  
    return {
      totalQuestions,
      attemptedCount,
      scorePercentage: parseFloat(scorePercentage.toFixed(2)),
      status:passed ? RoundStatus.Completed : RoundStatus.Failed,
      results: evaluationResults,
    };
  }
}

export default SubmitTest;
